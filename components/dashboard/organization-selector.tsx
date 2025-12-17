'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Organization, Membership } from '@/lib/types/database'

export function OrganizationSelector() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadOrganizations = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: memberships } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (!memberships) {
        setLoading(false)
        return
      }

      const orgIds = memberships.map(m => m.organization_id)
      const { data: orgs } = await supabase
        .from('organizations')
        .select('*')
        .in('id', orgIds)
        .is('deleted_at', null)

      setOrganizations(orgs || [])
      setLoading(false)
    }

    loadOrganizations()
  }, [supabase])

  if (loading) {
    return <div>Loading organizations...</div>
  }

  if (organizations.length === 0) {
    return (
      <div className="text-center text-slate-400">
        <p>No organizations found</p>
        <Button className="mt-4">Create Organization</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {organizations.map((org) => (
        <Card key={org.id} className="cursor-pointer hover:border-blue-500">
          <CardHeader>
            <CardTitle className="text-lg">{org.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-4">{org.description}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Navigate to org dashboard
              }}
            >
              Enter Organization
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
