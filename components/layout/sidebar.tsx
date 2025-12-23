"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
    LayoutDashboard,
    Users,
    Trophy,
    Briefcase,
    Settings,
    Shield,
    GraduationCap,
    ListTodo,
    ArrowUpRight,
    DollarSign
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Social Hub",
            icon: Users,
            href: "/dashboard/social",
            active: pathname === "/dashboard/social",
        },
        {
            label: "Projects",
            icon: ListTodo,
            href: "/dashboard/projects",
            active: pathname === "/dashboard/projects",
        },
        {
            label: "Organization",
            icon: Briefcase,
            href: "/dashboard/org",
            active: pathname === "/dashboard/org",
        },
        {
            label: "Esports",
            icon: Trophy,
            href: "/dashboard/competitive",
            active: pathname === "/dashboard/competitive",
        },
    ]

    const externalRoutes = [
        {
            label: "Services",
            icon: Shield,
            href: "/dashboard/services",
            active: pathname === "/dashboard/services",
        },
        {
            label: "Jobs",
            icon: Briefcase,
            href: "/dashboard/jobs",
            active: pathname === "/dashboard/jobs",
        },
        {
            label: "Courses",
            icon: GraduationCap,
            href: "/dashboard/courses",
            active: pathname === "/dashboard/courses",
        },
        {
            label: "Sponsorships",
            icon: DollarSign,
            href: "/dashboard/sponsorship",
            active: pathname === "/dashboard/sponsorship",
        },
    ]

    return (
        <div className={cn("pb-12 w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl hidden md:block flex flex-col h-full", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <div className="flex items-center pl-2 mb-8">
                        <Shield className="h-8 w-8 text-rose-500 mr-2" />
                        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                            Nexus
                        </h2>
                    </div>
                    <div className="space-y-1">
                        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500 uppercase">
                            Command Center
                        </h2>
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    route.active ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500 uppercase">
                        Armour Studios
                    </h2>
                    <div className="space-y-1">
                        {externalRoutes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    route.active ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 space-y-4">
                {/* Recruitment CTA */}
                <div className="rounded-xl bg-gradient-to-br from-rose-900/50 to-orange-900/50 border border-rose-500/20 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <GraduationCap className="h-5 w-5 text-rose-400" />
                        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">Recruitment Hub</h3>
                    <p className="text-xs text-rose-200/70 mb-3">Find scholarships & collegiate opportunities.</p>
                    <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-700 text-white border-0" asChild>
                        <Link href="/dashboard/recruitment">
                            Explore Now <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </div>

                {/* API Key Alert Area (Mock for now) */}
                <div className="rounded-md bg-slate-900 border border-slate-800 p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-slate-400">System Status: Online</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 border-slate-700 hover:bg-slate-800">
                        <Settings className="mr-2 h-3 w-3" />
                        Configure APIs
                    </Button>
                </div>
            </div>
        </div>
    )
}
