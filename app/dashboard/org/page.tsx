"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    Briefcase,
    Users,
    DollarSign,
    FileText,
    TrendingUp,
    UserPlus
} from "lucide-react"

export default function OrgPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Briefcase className="h-8 w-8 text-rose-500" />
                        Organization
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage your roster, contracts, and finances</p>
                </div>
                <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Player
                </Button>
            </div>

            <Tabs defaultValue="roster" className="w-full">
                <TabsList className="bg-muted">
                    <TabsTrigger value="roster">
                        <Users className="h-4 w-4 mr-2" />
                        Roster
                    </TabsTrigger>
                    <TabsTrigger value="contracts">
                        <FileText className="h-4 w-4 mr-2" />
                        Contracts
                    </TabsTrigger>
                    <TabsTrigger value="finances">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Finances
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="roster" className="mt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {["Valorant", "Rocket League", "CS2"].map((team) => (
                            <Card key={team} className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle>{team} Team</CardTitle>
                                    <CardDescription>5 active players</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Win Rate</span>
                                            <span className="font-semibold">68%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Avg. Salary</span>
                                            <span className="font-semibold">$45k</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="contracts" className="mt-6">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle>Active Contracts</CardTitle>
                            <CardDescription>Manage player and staff contracts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Contract management coming soon</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="finances" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Monthly Revenue
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231</div>
                                <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
