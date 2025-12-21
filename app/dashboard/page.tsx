'use client'

import { StatsCards } from '@/components/dashboard/stats-cards'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { AIAssistant } from '@/components/dashboard/ai-assistant'

export default function DashboardPage() {
  // Mock stats for display
  const stats = {
    players: 24,
    matches: 3,
    tasks: 12,
    revenue: 4500
  }

  // Use a hardcoded organization ID for the preview/assistant
  const demoOrgId = '00000000-0000-0000-0000-000000000000'

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-slate-400">Welcome back, Commander.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full border border-emerald-500/20">
            System Online
          </span>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <QuickActions />
          {/* AI Assistant sits here for easy access */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">AI Operations Assistant</h2>
            <AIAssistant organizationId={demoOrgId} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
