import { motion } from "framer-motion";
import { PageBanner, PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Eye,
  User,
  Clock,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";

// Mock approval suggestions
const approvalSuggestions = [
  { 
    id: 1, 
    actionName: "Release franchise commission payment", 
    requestedBy: "Finance Team",
    role: "finance",
    riskLevel: "low",
    aiRecommendation: "approve",
    confidence: 96,
    reason: "All verifications passed, within policy limits"
  },
  { 
    id: 2, 
    actionName: "Enable production database access", 
    requestedBy: "Developer #5",
    role: "developer",
    riskLevel: "high",
    aiRecommendation: "review",
    confidence: 72,
    reason: "First-time access request, recommend supervisor approval"
  },
  { 
    id: 3, 
    actionName: "Approve new reseller onboarding", 
    requestedBy: "Sales Lead",
    role: "sales",
    riskLevel: "medium",
    aiRecommendation: "approve",
    confidence: 88,
    reason: "KYC complete, background check passed"
  },
  { 
    id: 4, 
    actionName: "Bulk discount override (15%)", 
    requestedBy: "Country Head EU",
    role: "country_head",
    riskLevel: "medium",
    aiRecommendation: "reject",
    confidence: 81,
    reason: "Exceeds regional discount policy by 5%"
  },
  { 
    id: 5, 
    actionName: "Extend trial period for client", 
    requestedBy: "Support Team",
    role: "support",
    riskLevel: "low",
    aiRecommendation: "approve",
    confidence: 94,
    reason: "High-value prospect, within extension policy"
  },
];

const getRecommendationStyle = (rec: string) => {
  switch (rec) {
    case 'approve': return { bg: 'bg-accent-emerald/20', text: 'text-accent-emerald', icon: ThumbsUp };
    case 'reject': return { bg: 'bg-destructive/20', text: 'text-destructive', icon: ThumbsDown };
    case 'review': return { bg: 'bg-accent-amber/20', text: 'text-accent-amber', icon: Eye };
    default: return { bg: 'bg-muted/20', text: 'text-muted-foreground', icon: AlertTriangle };
  }
};

const getRiskStyle = (risk: string) => {
  switch (risk) {
    case 'high': return 'bg-destructive/20 text-destructive';
    case 'medium': return 'bg-accent-amber/20 text-accent-amber';
    default: return 'bg-accent-emerald/20 text-accent-emerald';
  }
};

const AICEOApprovals = () => {
  return (
    <PageShell>
      <PageBanner
        icon={CheckSquare}
        title="Approval Suggestions"
        subtitle="AI-recommended approval decisions with confidence scoring, rationale and one-click escalation to the Boss queue."
        status="Advisory only · no autonomous execution"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-accent-emerald/5 border-accent-emerald/20">
          <CardContent className="p-4 flex items-center gap-3">
            <ThumbsUp className="w-6 h-6 text-accent-emerald" />
            <div>
              <p className="text-2xl font-bold text-accent-emerald">3</p>
              <p className="text-xs text-muted-foreground">Recommend Approve</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent-amber/5 border-accent-amber/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Eye className="w-6 h-6 text-accent-amber" />
            <div>
              <p className="text-2xl font-bold text-accent-amber">1</p>
              <p className="text-xs text-muted-foreground">Recommend Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4 flex items-center gap-3">
            <ThumbsDown className="w-6 h-6 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-destructive">1</p>
              <p className="text-xs text-muted-foreground">Recommend Reject</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions List */}
      <Card className="premium-halo hover-lift shimmer-sweep enter-soft rounded-2xl">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary-glow" />
            Pending Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px]">
            <div className="space-y-4">
              {approvalSuggestions.map((suggestion, i) => {
                const recStyle = getRecommendationStyle(suggestion.aiRecommendation);
                const RecIcon = recStyle.icon;
                
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-surface border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{suggestion.actionName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{suggestion.requestedBy}</span>
                          <Badge variant="outline" className="text-xs">{suggestion.role}</Badge>
                        </div>
                      </div>
                      <Badge className={getRiskStyle(suggestion.riskLevel)}>
                        {suggestion.riskLevel} risk
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${recStyle.bg}`}>
                        <RecIcon className={`w-4 h-4 ${recStyle.text}`} />
                        <span className={`text-sm font-medium ${recStyle.text} uppercase`}>
                          {suggestion.aiRecommendation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <Progress value={suggestion.confidence} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-primary-glow">{suggestion.confidence}%</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      "{suggestion.reason}"
                    </p>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Awaiting decision</span>
                      </div>
                      <span className="text-xs text-primary-glow/60">Boss/CEO decides final</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-5 h-5 text-primary-glow" />
          <p className="text-sm text-primary-glow/80">
            <strong>Approval Notice:</strong> AI only suggests. Boss/CEO makes all final approval decisions.
          </p>
        </div>
      </div>
    </PageShell>
  );
};

export default AICEOApprovals;
