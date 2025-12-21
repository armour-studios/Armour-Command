'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, UserPlus, FileText, CheckCircle2 } from 'lucide-react'

// Placeholder data type
type ActivityType = 'roster_add' | 'match_scheduled' | 'task_complete' | 'file_upload'

interface Activity {
    id: string
    type: ActivityType
    title: string
    timestamp: string
    user: string
}

const recentActivity: Activity[] = [
    {
        id: '1',
        type: 'match_scheduled',
        title: 'Scrim vs Cloud9 Scheduled',
        timestamp: '2 hours ago',
        user: 'Coach Smith'
    },
    {
        id: '2',
        type: 'roster_add',
        title: 'New Player Added: "Viper"',
        timestamp: '5 hours ago',
        user: 'Admin'
    },
    {
        id: '3',
        type: 'task_complete',
        title: 'Sponsorship Deck Updated',
        timestamp: '1 day ago',
        user: 'Manager Doe'
    },
    {
        id: '4',
        type: 'file_upload',
        title: 'Contract Template v2.pdf',
        timestamp: '2 days ago',
        user: 'Legal Team'
    }
]

const iconMap = {
    roster_add: UserPlus,
    match_scheduled: Calendar,
    task_complete: CheckCircle2,
    file_upload: FileText
}

const colorMap = {
    roster_add: 'text-emerald-500',
    match_scheduled: 'text-amber-500',
    task_complete: 'text-blue-500',
    file_upload: 'text-purple-500'
}

export function ActivityFeed() {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {recentActivity.map((item) => {
                        const Icon = iconMap[item.type]
                        const colorClass = colorMap[item.type]

                        return (
                            <div key={item.id} className="flex items-start">
                                <div className={`mt-0.5 rounded-full p-1 bg-slate-800 border border-slate-700 ${colorClass}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium text-white">{item.title}</p>
                                    <p className="text-xs text-slate-500">
                                        {item.user} • {item.timestamp}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
