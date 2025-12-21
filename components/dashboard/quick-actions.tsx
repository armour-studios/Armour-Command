'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CalendarPlus, FilePlus, Zap } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/rosters/new" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full h-24 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-blue-500 transition-all"
                    >
                        <Plus className="h-6 w-6 text-blue-500" />
                        <span>New Roster</span>
                    </Button>
                </Link>

                <Link href="/dashboard/calendar" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full h-24 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-amber-500 transition-all"
                    >
                        <CalendarPlus className="h-6 w-6 text-amber-500" />
                        <span>Schedule Scrim</span>
                    </Button>
                </Link>

                <Link href="/dashboard/files" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full h-24 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-emerald-500 transition-all"
                    >
                        <FilePlus className="h-6 w-6 text-emerald-500" />
                        <span>Upload File</span>
                    </Button>
                </Link>

                <Link href="/dashboard/image-gen" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full h-24 flex flex-col gap-2 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-purple-500 transition-all"
                    >
                        <Zap className="h-6 w-6 text-purple-500" />
                        <span>Generate Image</span>
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
