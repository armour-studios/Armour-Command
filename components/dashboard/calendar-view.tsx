'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Event } from '@/lib/types/database'

interface CalendarViewProps {
  organizationId: string
  teamId?: string
}

export function CalendarView({ organizationId, teamId }: CalendarViewProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadEvents = async () => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true })
        .limit(10)

      if (teamId) {
        query = query.eq('team_id', teamId)
      }

      const { data } = await query
      setEvents(data || [])
      setLoading(false)
    }

    loadEvents()
  }, [organizationId, teamId, supabase])

  if (loading) {
    return <div>Loading events...</div>
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-slate-400">No upcoming events</p>
        ) : (
          <div className="space-y-2">
            {events.map(event => (
              <div
                key={event.id}
                className="p-3 bg-slate-700 rounded-md border border-slate-600"
              >
                <div className="font-semibold text-white">{event.title}</div>
                <div className="text-sm text-slate-400">
                  {new Date(event.start_time).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {event.event_type}
                </div>
              </div>
            ))}
          </div>
        )}
        <Button variant="outline" className="w-full mt-4">
          View Calendar
        </Button>
      </CardContent>
    </Card>
  )
}
