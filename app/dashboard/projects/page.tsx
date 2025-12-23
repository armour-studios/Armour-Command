"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Plus,
    MoreHorizontal,
    Calendar,
    Users,
    Tag,
    CheckCircle2,
    Circle,
    Clock,
    LayoutGrid,
    List
} from "lucide-react"

export default function ProjectsPage() {
    const columns = [
        {
            id: "todo",
            title: "To Do",
            color: "slate",
            tasks: [
                { id: 1, title: "Design new team jerseys", assignee: "Sarah", priority: "high", dueDate: "Dec 28" },
                { id: 2, title: "Schedule scrims for next week", assignee: "Marcus", priority: "medium", dueDate: "Dec 25" },
            ]
        },
        {
            id: "in-progress",
            title: "In Progress",
            color: "blue",
            tasks: [
                { id: 3, title: "Review player contracts", assignee: "Alex", priority: "high", dueDate: "Dec 24" },
                { id: 4, title: "Update social media content", assignee: "Sarah", priority: "low", dueDate: "Dec 30" },
            ]
        },
        {
            id: "review",
            title: "Review",
            color: "orange",
            tasks: [
                { id: 5, title: "Tournament registration", assignee: "Marcus", priority: "high", dueDate: "Dec 23" },
            ]
        },
        {
            id: "done",
            title: "Done",
            color: "emerald",
            tasks: [
                { id: 6, title: "Finalize roster for VCT", assignee: "Alex", priority: "high", dueDate: "Dec 20" },
                { id: 7, title: "Submit team logo to organizers", assignee: "Sarah", priority: "medium", dueDate: "Dec 19" },
            ]
        },
    ]

    const priorityColors = {
        high: "text-red-400 bg-red-500/10 border-red-500/20",
        medium: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        low: "text-slate-400 bg-slate-500/10 border-slate-500/20",
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage tasks and workflows for your organization</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <List className="mr-2 h-4 w-4" />
                        List View
                    </Button>
                    <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700">
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="board" className="w-full">
                <TabsList className="bg-muted">
                    <TabsTrigger value="board">
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Board
                    </TabsTrigger>
                    <TabsTrigger value="timeline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Timeline
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="board" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {columns.map((column) => (
                            <div key={column.id} className="flex flex-col gap-4">
                                {/* Column Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full bg-${column.color}-500`} />
                                        <h3 className="font-semibold text-sm">{column.title}</h3>
                                        <span className="text-xs text-muted-foreground">({column.tasks.length})</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-3">
                                    {column.tasks.map((task) => (
                                        <Card key={task.id} className="bg-card border-border hover:border-rose-500/20 transition-colors cursor-pointer group">
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex items-start justify-between">
                                                    <CardTitle className="text-sm font-medium leading-tight">
                                                        {task.title}
                                                    </CardTitle>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{task.dueDate}</span>
                                                    </div>
                                                    <Avatar className="h-6 w-6 border border-border">
                                                        <AvatarFallback className="text-xs bg-muted">
                                                            {task.assignee[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Add Task Button */}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted border border-dashed border-border"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add task
                                </Button>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                    <Card className="bg-card border-border">
                        <CardContent className="p-8">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <Calendar className="h-12 w-12 text-muted-foreground" />
                                <div>
                                    <h3 className="text-lg font-semibold">Timeline View</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Timeline visualization coming soon
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
