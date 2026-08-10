import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  User, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Shield
} from "lucide-react";

// Mock live action stream
const liveActions = [
  { id: 1, actor: "CEO", action: "Viewed revenue report", role: "ceo", location: "HQ", impact: "low", risk: 5, time: "Just now" },
  { id: 2, actor: "Admin #12", action: "Created 5 new users", role: "admin", location: "Europe", impact: "medium", risk: 25, time: "30s ago" },
  { id: 3, actor: "Franchise #101", action: "Requested withdrawal $5,000", role: "franchise", location: "USA", impact: "high", risk: 45, time: "1m ago" },
  { id: 4, actor: "Super Admin", action: "Modified permission matrix", role: "super_admin", location: "HQ", impact: "critical", risk: 70, time: "2m ago" },
  { id: 5, actor: "Country Head", action: "Approved lead assignment", role: "country_head", location: "India", impact: "low", risk: 10, time: "3m ago" },
  { id: 6, actor: "Reseller #45", action: "Generated demo link", role: "reseller", location: "UK", impact: "low", risk: 5, time: "4m ago" },
  { id: 7, actor: "Lead Manager", action: "Bulk assigned 50 leads", role: "lead_manager", location: "Australia", impact: "medium", risk: 30, time: "5m ago" },
  { id: 8, actor: "Developer #7", action: "Deployed hotfix v2.3.1", role: "developer", location: "Remote", impact: "high", risk: 55, time: "8m ago" },
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
    case 'high': return 'bg-accent-amber/20 text-accent-amber border-accent-amber/30';
    case 'medium': return 'bg-accent-amber/20 text-accent-amber border-accent-amber/30';
    default: return 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30';
  }
};

const getRiskBadge = (risk: number) => {
  if (risk >= 60) return { label: 'Review Needed', color: 'bg-destructive/20 text-destructive' };
  if (risk >= 30) return { label: 'Monitor', color: 'bg-accent-amber/20 text-accent-amber' };
  return { label: 'Normal', color: 'bg-accent-emerald/20 text-accent-emerald' };
};

const AICEOLiveMonitor = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-emerald via-primary to-primary flex items-center justify-center shadow-xl shadow-accent-emerald/20">
            <Activity className="w-7 h-7 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Action Monitor</h1>
            <p className="text-primary-glow/80">Real-time stream of all system actions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30 animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            STREAMING LIVE
          </Badge>
          <Badge className="bg-secondary text-foreground">
            {liveActions.length} actions/min
          </Badge>
        </div>
      </div>

      {/* Filter Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "CEO", count: 12, icon: Eye },
          { label: "Admins", count: 45, icon: Shield },
          { label: "Franchises", count: 89, icon: User },
          { label: "High Risk", count: 8, icon: AlertTriangle },
          { label: "Completed", count: 234, icon: CheckCircle },
        ].map((stat, i) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-primary-glow" />
              <div>
                <p className="text-lg font-bold text-foreground">{stat.count}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Action Stream */}
      <Card className="bg-card border-border backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-glow" />
            Action Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {liveActions.map((action, i) => {
                const riskBadge = getRiskBadge(action.risk);
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-lg bg-surface border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-glow" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{action.actor}</span>
                            <Badge variant="outline" className="text-xs">
                              {action.role.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{action.action}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{action.location}</span>
                        </div>
                        <Badge className={getImpactColor(action.impact)}>
                          {action.impact}
                        </Badge>
                        <Badge className={riskBadge.color}>
                          Risk: {action.risk}%
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{action.time}</span>
                        </div>
                      </div>
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
          <Eye className="w-5 h-5 text-primary-glow" />
          <p className="text-sm text-primary-glow/80">
            <strong>Observation Mode:</strong> AI CEO monitors all actions but does not interfere. High-risk actions are flagged for Boss/CEO review.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEOLiveMonitor;
