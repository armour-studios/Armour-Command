"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Users,
  Trophy,
  DollarSign,
  Activity,
  Target,
  Calendar,
  BarChart3
} from "lucide-react"

export default function DashboardPage() {
  const stats = [
    { label: "Total Revenue", value: "$45,231", change: "+20.1%", icon: DollarSign, trend: "up" },
    { label: "Active Players", value: "24", change: "+4", icon: Users, trend: "up" },
    { label: "Tournaments Won", value: "12", change: "+3", icon: Trophy, trend: "up" },
    { label: "Win Rate", value: "68%", change: "+5.2%", icon: Target, trend: "up" },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Last 30 days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-slate-950 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Performance Overview</CardTitle>
            <CardDescription>Your organization's monthly performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-800 rounded-lg">
              <div className="text-center space-y-2">
                <BarChart3 className="h-12 w-12 text-slate-700 mx-auto" />
                <p className="text-sm text-slate-500">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { event: "Tournament Win", team: "Valorant Team", time: "2 hours ago" },
                { event: "New Player Signed", team: "Rocket League", time: "5 hours ago" },
                { event: "Sponsorship Deal", team: "Organization", time: "1 day ago" },
                { event: "Practice Session", team: "CS2 Team", time: "2 days ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-white leading-none">{activity.event}</p>
                    <p className="text-xs text-slate-500">{activity.team}</p>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Team Performance</CardTitle>
          <CardDescription>Individual team statistics and rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="valorant" className="w-full">
            <TabsList className="bg-slate-900">
              <TabsTrigger value="valorant">Valorant</TabsTrigger>
              <TabsTrigger value="rl">Rocket League</TabsTrigger>
              <TabsTrigger value="cs2">CS2</TabsTrigger>
            </TabsList>
            <TabsContent value="valorant" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Rank</p>
                  <p className="text-2xl font-bold text-white">#12</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Win Rate</p>
                  <p className="text-2xl font-bold text-white">72%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Matches</p>
                  <p className="text-2xl font-bold text-white">45</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
