'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TeamMember } from '@/lib/types/database'

interface RosterViewProps {
  teamId: string
}

export function RosterView({ teamId }: RosterViewProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadMembers = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .eq('status', 'active')
        .order('jersey_number')

      setMembers(data || [])
      setLoading(false)
    }

    loadMembers()
  }, [teamId, supabase])

  if (loading) {
    return <div>Loading roster...</div>
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle>Team Roster</CardTitle>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="text-slate-400">No team members</p>
        ) : (
          <div className="space-y-2">
            {members.map(member => (
              <div
                key={member.id}
                className="p-3 bg-slate-700 rounded-md border border-slate-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-sm text-slate-400">
                      {member.position || 'No position assigned'}
                    </div>
                  </div>
                  {member.jersey_number && (
                    <div className="text-xl font-bold text-blue-400">
                      #{member.jersey_number}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
