import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Lock,
  Eye,
  Bell,
  Shield,
  Clock,
  Globe
} from "lucide-react";

// Read-only settings display
const settingsConfig = [
  {
    category: "Monitoring",
    icon: Eye,
    settings: [
      { label: "Real-time action monitoring", value: true, locked: true },
      { label: "Risk detection alerts", value: true, locked: true },
      { label: "Performance tracking", value: true, locked: true },
    ]
  },
  {
    category: "Notifications",
    icon: Bell,
    settings: [
      { label: "Daily summary to Boss", value: true, locked: true },
      { label: "Weekly report to CEO", value: true, locked: true },
      { label: "Critical alerts immediate", value: true, locked: true },
    ]
  },
  {
    category: "Security",
    icon: Shield,
    settings: [
      { label: "Fraud detection enabled", value: true, locked: true },
      { label: "Anomaly flagging", value: true, locked: true },
      { label: "Audit logging", value: true, locked: true },
    ]
  },
  {
    category: "System",
    icon: Globe,
    settings: [
      { label: "24/7 active mode", value: true, locked: true },
      { label: "Auto-learning enabled", value: true, locked: true },
      { label: "Multi-region monitoring", value: true, locked: true },
    ]
  },
];

const AICEOSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted via-surface to-secondary flex items-center justify-center shadow-xl shadow-muted/20">
            <Settings className="w-7 h-7 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-primary-glow/80">AI CEO configuration (Read-Only)</p>
          </div>
        </div>
        <Badge className="bg-muted/20 text-muted-foreground border-muted/30">
          <Lock className="w-3 h-3 mr-1" />
          READ-ONLY MODE
        </Badge>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-6">
        {settingsConfig.map((category, i) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card border-border backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <category.icon className="w-5 h-5 text-primary-glow" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.settings.map((setting, j) => (
                  <div 
                    key={j}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Label className="text-sm text-foreground">{setting.label}</Label>
                      {setting.locked && (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <Switch 
                      checked={setting.value} 
                      disabled={setting.locked}
                      className="cursor-not-allowed opacity-60"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* System Info */}
      <Card className="bg-card border-border backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-glow" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-surface border border-border">
              <p className="text-xs text-muted-foreground mb-1">AI Version</p>
              <p className="text-lg font-bold text-foreground">v2.0.4</p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border">
              <p className="text-xs text-muted-foreground mb-1">Model Version</p>
              <p className="text-lg font-bold text-foreground">ML-3.2</p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border">
              <p className="text-xs text-muted-foreground mb-1">Last Training</p>
              <p className="text-lg font-bold text-foreground">2 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-muted/5 border border-muted/20">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <strong>Settings Notice:</strong> AI CEO settings are controlled by the system and cannot be modified. Contact Boss/Owner for configuration changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEOSettings;
