'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy, CheckSquare, DollarSign } from 'lucide-react'

interface StatsCardsProps {
  stats?: {
    players: number
    matches: number
    tasks: number
    revenue: number
  }
}

export function StatsCards({ stats = { players: 0, matches: 0, tasks: 0, revenue: 0 } }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Total Players
          </CardTitle>
          <Users className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.players}</div>
          <p className="text-xs text-slate-500">
            Active roster members
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Upcoming Matches
          </CardTitle>
          <Trophy className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.matches}</div>
          <p className="text-xs text-slate-500">
            Next 7 days
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Open Tasks
          </CardTitle>
          <CheckSquare className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.tasks}</div>
          <p className="text-xs text-slate-500">
            Pending completion
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Monthly Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">${stats.revenue}</div>
          <p className="text-xs text-slate-500">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
