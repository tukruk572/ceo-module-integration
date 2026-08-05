import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface CEOSuggestion {
  id: string;
  type: 'growth' | 'risk' | 'cost' | 'efficiency' | 'product' | 'compliance';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  impactArea: string;
  status: 'pending' | 'approved' | 'rejected' | 'reviewed';
  createdAt: string;
  source: 'AI-CEO' | 'System' | 'Analytics';
}

export interface EcosystemMetrics {
  systemActivityRate: number;
  deploymentFrequency: number;
  errorVelocity: number;
  activeUsers: number;
  transactionsToday: number;
  apiLatency: number;
}

export interface AIObservation {
  id: string;
  category: 'change' | 'attention' | 'revenue';
  title: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  type: 'risk' | 'revenue' | 'operations' | 'security' | 'compliance';
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  impact: 'positive' | 'negative' | 'neutral';
}

// Realistic seed suggestions used until the live AI API is connected
const generateSeedSuggestions = (): CEOSuggestion[] => [
  {
    id: 'sug-001',
    type: 'growth',
    title: 'Expand to Southeast Asia Market',
    description: 'Based on market analysis, Vietnam and Indonesia show 40% YoY growth potential in our sector. Recommend initiating market research.',
    confidence: 92,
    impact: 'high',
    impactArea: 'Revenue Growth',
    status: 'pending',
    createdAt: new Date().toISOString(),
    source: 'AI-CEO'
  },
  {
    id: 'sug-002',
    type: 'risk',
    title: 'Middle East Revenue Decline Alert',
    description: 'Revenue dropped 2.1% this quarter. Recommend reviewing local franchise operations and market conditions.',
    confidence: 87,
    impact: 'medium',
    impactArea: 'Risk Mitigation',
    status: 'pending',
    createdAt: new Date().toISOString(),
    source: 'AI-CEO'
  },
  {
    id: 'sug-003',
    type: 'cost',
    title: 'Optimize Cloud Infrastructure Costs',
    description: 'AI analysis shows 18% over-provisioning in APAC servers. Recommend right-sizing to save $4,200/month.',
    confidence: 94,
    impact: 'medium',
    impactArea: 'Cost Reduction',
    status: 'pending',
    createdAt: new Date().toISOString(),
    source: 'AI-CEO'
  },
  {
    id: 'sug-004',
    type: 'efficiency',
    title: 'Implement AI Chatbot for Support',
    description: 'AI chatbot implementation could reduce support costs by 35% while maintaining satisfaction scores.',
    confidence: 91,
    impact: 'high',
    impactArea: 'Operational Efficiency',
    status: 'pending',
    createdAt: new Date().toISOString(),
    source: 'AI-CEO'
  },
  {
    id: 'sug-005',
    type: 'product',
    title: 'Enterprise Solution Gap Identified',
    description: 'Competitors gaining traction with enterprise solutions. Consider expanding product portfolio to capture B2B market.',
    confidence: 78,
    impact: 'high',
    impactArea: 'Market Position',
    status: 'pending',
    createdAt: new Date().toISOString(),
    source: 'Analytics'
  }
];

// Generate ecosystem metrics (refreshed on an interval)
const generateEcosystemMetrics = (): EcosystemMetrics => ({
  systemActivityRate: 847 + Math.floor(Math.random() * 50),
  deploymentFrequency: 12 + Math.floor(Math.random() * 5),
  errorVelocity: 3 + Math.floor(Math.random() * 2),
  activeUsers: 2340 + Math.floor(Math.random() * 100),
  transactionsToday: 4521 + Math.floor(Math.random() * 200),
  apiLatency: 45 + Math.floor(Math.random() * 10)
});

// Generate AI observations
const generateObservations = (): AIObservation[] => [
  {
    id: 'obs-001',
    category: 'change',
    title: 'New deployment in Production',
    detail: 'v2.4.1 deployed successfully with 0 errors. 3 new features activated.',
    severity: 'info',
    timestamp: '15 min ago'
  },
  {
    id: 'obs-002',
    category: 'attention',
    title: 'Support ticket surge detected',
    detail: 'Ticket volume up 34% in last 2 hours. May need additional staffing.',
    severity: 'warning',
    timestamp: '28 min ago'
  },
  {
    id: 'obs-003',
    category: 'revenue',
    title: 'High-value deal approaching close',
    detail: 'Enterprise client #892 showing strong buy signals. Estimated value: $45K ARR.',
    severity: 'info',
    timestamp: '1 hour ago'
  },
  {
    id: 'obs-004',
    category: 'attention',
    title: 'API latency spike in EU region',
    detail: 'Response times increased 23% in Frankfurt datacenter. Monitoring.',
    severity: 'warning',
    timestamp: '2 hours ago'
  },
  {
    id: 'obs-005',
    category: 'revenue',
    title: 'Subscription renewal rate declining',
    detail: 'Monthly renewal rate dropped from 94% to 91%. Churn risk increasing.',
    severity: 'critical',
    timestamp: '3 hours ago'
  }
];

// Generate activity events
const generateActivityEvents = (): ActivityEvent[] => [
  {
    id: 'act-001',
    type: 'revenue',
    actor: 'Franchise #101',
    action: 'Closed deal',
    target: 'Enterprise Client',
    timestamp: '5 min ago',
    impact: 'positive'
  },
  {
    id: 'act-002',
    type: 'risk',
    actor: 'System',
    action: 'Flagged unusual pattern',
    target: 'User #45892',
    timestamp: '12 min ago',
    impact: 'negative'
  },
  {
    id: 'act-003',
    type: 'operations',
    actor: 'DevOps',
    action: 'Deployed hotfix',
    target: 'Payment Module',
    timestamp: '23 min ago',
    impact: 'positive'
  },
  {
    id: 'act-004',
    type: 'security',
    actor: 'AI-Security',
    action: 'Blocked suspicious login',
    target: 'Admin account',
    timestamp: '45 min ago',
    impact: 'positive'
  },
  {
    id: 'act-005',
    type: 'compliance',
    actor: 'Legal Bot',
    action: 'Updated terms',
    target: 'Privacy Policy',
    timestamp: '1 hour ago',
    impact: 'neutral'
  },
  {
    id: 'act-006',
    type: 'revenue',
    actor: 'Reseller #23',
    action: 'Lost client',
    target: 'SMB Account',
    timestamp: '2 hours ago',
    impact: 'negative'
  }
];

// Shared in-session Boss review queue
const bossQueue = new Map<string, CEOSuggestion>();

export function useCEOSuggestions() {
  const [suggestions, setSuggestions] = useState<CEOSuggestion[]>([]);
  const [ecosystemMetrics, setEcosystemMetrics] = useState<EcosystemMetrics | null>(null);
  const [observations, setObservations] = useState<AIObservation[]>([]);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Set after mount so server and client HTML match
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Load initial data
  useEffect(() => {
    setSuggestions(generateSeedSuggestions());
    setEcosystemMetrics(generateEcosystemMetrics());
    setObservations(generateObservations());
    setActivityEvents(generateActivityEvents());
    setLastRefresh(new Date());
    setIsLoading(false);
  }, []);

  // Auto-refresh ecosystem metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setEcosystemMetrics(generateEcosystemMetrics());
      setLastRefresh(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Send suggestion to the Boss review queue.
  // Local queue until the AI CEO backend API is connected.
  const sendToBoss = useCallback(async (suggestionId: string) => {
    const suggestion = suggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return false;

    bossQueue.set(suggestion.id, { ...suggestion, status: 'pending' });

    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, status: 'reviewed' as const } : s))
    );

    toast.success('Suggestion sent to Boss', {
      description: `"${suggestion.title}" is now visible in the Boss dashboard`,
    });

    return true;
  }, [suggestions]);

  // Suggestions awaiting the Boss decision
  const getBossSuggestions = useCallback(async (): Promise<CEOSuggestion[]> => {
    return Array.from(bossQueue.values())
      .filter((s) => s.status === 'pending')
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 10);
  }, []);

  // Acknowledge suggestion (Boss action)
  const acknowledgeSuggestion = useCallback(
    async (suggestionId: string, decision: 'approved' | 'rejected') => {
      const existing = bossQueue.get(suggestionId);
      if (existing) bossQueue.set(suggestionId, { ...existing, status: decision });

      setSuggestions((prev) =>
        prev.map((s) => (s.id === suggestionId ? { ...s, status: decision } : s))
      );

      toast.success(`Suggestion ${decision}`, {
        description: 'CEO will be notified of your decision',
      });

      return true;
    },
    []
  );

  // Filter observations by category
  const getObservationsByCategory = useCallback((category: 'change' | 'attention' | 'revenue') => {
    return observations.filter(obs => obs.category === category);
  }, [observations]);

  // Filter activity events by type
  const getEventsByType = useCallback((type?: ActivityEvent['type']) => {
    if (!type) return activityEvents;
    return activityEvents.filter(evt => evt.type === type);
  }, [activityEvents]);

  return {
    suggestions,
    ecosystemMetrics,
    observations,
    activityEvents,
    isLoading,
    lastRefresh,
    sendToBoss,
    getBossSuggestions,
    acknowledgeSuggestion,
    getObservationsByCategory,
    getEventsByType
  };
}
