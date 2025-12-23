"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Trophy, Users, Target } from "lucide-react"

export default function RecruitmentPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-rose-500" />
                        Recruitment Hub
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Find scholarships and collegiate esports opportunities</p>
                </div>
                <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700">
                    Apply Now
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-card border-border hover:border-rose-500/20 transition-colors">
                    <CardHeader>
                        <Trophy className="h-8 w-8 text-rose-500 mb-2" />
                        <CardTitle>Scholarship Programs</CardTitle>
                        <CardDescription>Full and partial scholarships available</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Connect with collegiate programs offering esports scholarships.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border hover:border-blue-500/20 transition-colors">
                    <CardHeader>
                        <Users className="h-8 w-8 text-blue-500 mb-2" />
                        <CardTitle>Team Opportunities</CardTitle>
                        <CardDescription>Join competitive collegiate teams</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Explore team rosters and tryout opportunities at top universities.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border hover:border-emerald-500/20 transition-colors">
                    <CardHeader>
                        <Target className="h-8 w-8 text-emerald-500 mb-2" />
                        <CardTitle>Career Pathways</CardTitle>
                        <CardDescription>Build your esports career</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Get guidance on transitioning from amateur to professional esports.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
