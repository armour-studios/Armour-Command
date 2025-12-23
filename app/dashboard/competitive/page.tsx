"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Trophy,
    Calendar,
    Users,
    Target,
    Swords,
    Medal,
    TrendingUp,
    Clock
} from "lucide-react"

export default function CompetitivePage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-rose-500" />
                        Esports Hub
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Tournaments, scrims, and competitive analytics</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20">
                        <Calendar className="mr-2 h-4 w-4 text-rose-500" />
                        Schedule Scrim
                    </Button>
                    <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700">
                        <Swords className="mr-2 h-4 w-4" />
                        Join Tournament
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="tournaments" className="w-full">
                <TabsList className="bg-muted">
                    <TabsTrigger value="tournaments">
                        <Trophy className="h-4 w-4 mr-2" />
                        Tournaments
                    </TabsTrigger>
                    <TabsTrigger value="scrims">
                        <Swords className="h-4 w-4 mr-2" />
                        Scrims
                    </TabsTrigger>
                    <TabsTrigger value="stats">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Statistics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tournaments" className="mt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-card border-border hover:border-rose-500/20 transition-colors">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>VCT Americas Qualifier</CardTitle>
                                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Registered
                                    </span>
                                </div>
                                <CardDescription>Valorant · Dec 28-30, 2024</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Prize Pool</span>
                                    <span className="font-semibold">$50,000</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Teams</span>
                                    <span className="font-semibold">32/32</span>
                                </div>
                                <Button className="w-full bg-rose-600 hover:bg-rose-700">View Bracket</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-blue-500/20 transition-colors">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>RLCS Winter Open</CardTitle>
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        Open
                                    </span>
                                </div>
                                <CardDescription>Rocket League · Jan 5-7, 2025</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Prize Pool</span>
                                    <span className="font-semibold">$25,000</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Teams</span>
                                    <span className="font-semibold">18/64</span>
                                </div>
                                <Button variant="outline" className="w-full">Register Now</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="scrims" className="mt-6">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle>Upcoming Scrims</CardTitle>
                            <CardDescription>Practice matches scheduled for your teams</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { team: "Valorant", opponent: "Cloud9 Academy", time: "Tonight, 8:00 PM", status: "Confirmed" },
                                { team: "Rocket League", opponent: "G2 Next", time: "Tomorrow, 6:00 PM", status: "Pending" },
                                { team: "CS2", opponent: "Liquid Academy", time: "Dec 25, 7:00 PM", status: "Confirmed" },
                            ].map((scrim, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted border border-border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{scrim.team} vs {scrim.opponent}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {scrim.time}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${scrim.status === "Confirmed"
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                        }`}>
                                        {scrim.status}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Overall Win Rate
                                </CardTitle>
                                <Target className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">68%</div>
                                <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +5.2% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Tournaments Won
                                </CardTitle>
                                <Medal className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +3 this month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Active Players
                                </CardTitle>
                                <Users className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">24</div>
                                <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +4 new signees
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
