import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

import {
  decideSuggestion,
  loadBossQueue,
  loadCeoState,
  recordRefresh,
  sendSuggestionToBoss,
} from '@/lib/ceo-insights.functions';
import {
  generateActivityEvents,
  generateEcosystemMetrics,
  generateObservations,
  generateSeedSuggestions,
} from '@/lib/ceo-seed';
import type {
  ActivityEvent,
  AIObservation,
  CEOSuggestion,
  EcosystemMetrics,
} from '@/lib/ceo-types';

export type { ActivityEvent, AIObservation, CEOSuggestion, EcosystemMetrics };

// Fallback Boss review queue, used only while the Prisma API is unreachable
const localBossQueue = new Map<string, CEOSuggestion>();

export function useCEOSuggestions() {
  const [suggestions, setSuggestions] = useState<CEOSuggestion[]>([]);
  const [approvals, setApprovals] = useState<CEOSuggestion[]>([]);
  const [ecosystemMetrics, setEcosystemMetrics] = useState<EcosystemMetrics | null>(null);
  const [observations, setObservations] = useState<AIObservation[]>([]);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  // Null until hydrated from the database so server and client HTML match
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isPersisted, setIsPersisted] = useState(false);
  const [queueIsPersisted, setQueueIsPersisted] = useState(false);
  const seedSuggestions = useRef<CEOSuggestion[] | null>(null);
  const hasLoadedLiveSuggestions = useRef(false);
  const hasLoadedLiveQueue = useRef(false);

  // Refresh live suggestions and the Boss approval queue together. Seed data is
  // used only when the AIRA API cannot supply a persisted response.
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshError(null);

    try {
      const [state, queue] = await Promise.all([
        loadCeoState().catch(() => ({ persisted: false, suggestions: [], lastRefresh: null })),
        loadBossQueue().catch(() => ({ persisted: false, suggestions: [] })),
      ]);

      if (state.persisted) {
        hasLoadedLiveSuggestions.current = true;
        setSuggestions(state.suggestions);
      } else if (!hasLoadedLiveSuggestions.current) {
        setSuggestions((current) => {
          if (current.length) return current;
          seedSuggestions.current ??= generateSeedSuggestions();
          return seedSuggestions.current;
        });
      }
      if (queue.persisted) {
        hasLoadedLiveQueue.current = true;
        setApprovals(queue.suggestions);
      } else if (!hasLoadedLiveQueue.current) {
        setApprovals(Array.from(localBossQueue.values()));
      }
      setIsPersisted(state.persisted || hasLoadedLiveSuggestions.current);
      setQueueIsPersisted(queue.persisted || hasLoadedLiveQueue.current);
      setEcosystemMetrics((current) => current ?? generateEcosystemMetrics());
      setObservations((current) => current.length ? current : generateObservations());
      setActivityEvents((current) => current.length ? current : generateActivityEvents());

      const now = new Date().toISOString();
      const refreshed = await recordRefresh({ data: { at: now } }).catch(() => null);
      setLastRefresh(
        new Date(refreshed?.persisted ? refreshed.lastRefresh : (state.lastRefresh ?? now)),
      );

      if (!state.persisted && hasLoadedLiveSuggestions.current) {
        setRefreshError('AIRA is unavailable; showing the last loaded live suggestions.');
      } else if (!state.persisted) {
        setRefreshError('AIRA live suggestions are unavailable; showing seed suggestions.');
      } else if (!queue.persisted) {
        setRefreshError(hasLoadedLiveQueue.current
          ? 'AIRA approval queue is unavailable; showing the last loaded queue.'
          : 'AIRA suggestions are live, but the approval queue could not be loaded.');
      }
    } catch {
      setRefreshError('Unable to refresh AI CEO data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial sync, then poll the AIRA-backed state and approval queue every 30s.
  useEffect(() => {
    void refresh();
    const interval = setInterval(() => void refresh(), 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Send suggestion to the Boss review queue (persisted as an ai_insights row)
  const sendToBoss = useCallback(
    async (suggestionId: string) => {
      const suggestion = suggestions.find((s) => s.id === suggestionId);
      if (!suggestion) return false;

      const result = await sendSuggestionToBoss({ data: { suggestion } });
      if (!result.persisted) {
        localBossQueue.set(suggestion.id, { ...suggestion, status: 'pending' });
      }
      setApprovals((previous) => [
        { ...suggestion, status: 'pending' },
        ...previous.filter((item) => item.id !== suggestion.id),
      ]);

      setSuggestions((prev) =>
        prev.map((s) => (s.id === suggestionId ? { ...s, status: 'reviewed' as const } : s)),
      );

      toast.success('Suggestion sent to Boss', {
        description: result.persisted
          ? `"${suggestion.title}" is now visible in the Boss dashboard`
          : `"${suggestion.title}" queued locally — AI API unavailable`,
      });

      return true;
    },
    [suggestions],
  );

  // Suggestions awaiting the Boss decision
  const getBossSuggestions = useCallback(async (): Promise<CEOSuggestion[]> => {
    const result = await loadBossQueue();
    const rows = result.persisted ? result.suggestions : Array.from(localBossQueue.values());
    return rows
      .filter((s) => s.status === 'pending')
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 10);
  }, []);

  // Acknowledge suggestion (Boss action)
  const acknowledgeSuggestion = useCallback(
    async (suggestionId: string, decision: 'approved' | 'rejected') => {
      const result = await decideSuggestion({ data: { id: suggestionId, decision } });
      if (!result.persisted) {
        const existing = localBossQueue.get(suggestionId);
        if (existing) localBossQueue.set(suggestionId, { ...existing, status: decision });
      }
      setApprovals((previous) => previous.map((item) =>
        item.id === suggestionId ? { ...item, status: decision } : item,
      ));

      setSuggestions((prev) =>
        prev.map((s) => (s.id === suggestionId ? { ...s, status: decision } : s)),
      );

      toast.success(`Suggestion ${decision}`, {
        description: 'CEO will be notified of your decision',
      });

      return true;
    },
    [],
  );

  // Filter observations by category
  const getObservationsByCategory = useCallback(
    (category: 'change' | 'attention' | 'revenue') =>
      observations.filter((obs) => obs.category === category),
    [observations],
  );

  // Filter activity events by type
  const getEventsByType = useCallback(
    (type?: ActivityEvent['type']) => (!type ? activityEvents : activityEvents.filter((evt) => evt.type === type)),
    [activityEvents],
  );

  return {
    suggestions,
    approvals,
    ecosystemMetrics,
    observations,
    activityEvents,
    isLoading,
    isRefreshing,
    refreshError,
    isPersisted,
    queueIsPersisted,
    lastRefresh,
    refresh,
    sendToBoss,
    getBossSuggestions,
    acknowledgeSuggestion,
    getObservationsByCategory,
    getEventsByType
  };
}
