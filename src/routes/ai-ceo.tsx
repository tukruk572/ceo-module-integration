import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

import AICEOHeader from "@/components/ai-ceo/AICEOHeader";
import AICEOSidebar from "@/components/ai-ceo/AICEOSidebar";

export const Route = createFileRoute("/ai-ceo")({
  head: () => ({
    meta: [
      { title: "AI CEO Command Center — Software Vala" },
      {
        name: "description",
        content:
          "Autonomous AI CEO command center: live action monitoring, decision engine, approvals, risk, performance intelligence and predictive insights.",
      },
      { property: "og:title", content: "AI CEO Command Center — Software Vala" },
      {
        property: "og:description",
        content:
          "Observer and advisor AI CEO: live monitoring, decisions, approvals, risk, performance and predictions.",
      },
    ],
  }),
  component: AICEODashboard,
});

function AICEODashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [streamingOn, setStreamingOn] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const activeSection = (() => {
    const path = pathname.split("/").pop() || "dashboard";
    return path === "ai-ceo" ? "dashboard" : path;
  })();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a10] via-[#0d0d14] to-[#0a0a10] text-white flex flex-col">
        <AICEOHeader
          streamingOn={streamingOn}
          onStreamingToggle={() => setStreamingOn(!streamingOn)}
        />

        <div className="flex flex-1 pt-16">
          <AICEOSidebar
            activeSection={activeSection}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />

          <main
            className={`flex-1 min-w-0 transition-all duration-300 ${
              sidebarCollapsed ? "ml-20" : "ml-64"
            } p-4 sm:p-6`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
