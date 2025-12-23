"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // Close sheet when route changes
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-slate-950 border-slate-800 w-72">
                <Sidebar className="block md:block w-full border-none bg-transparent" />
            </SheetContent>
        </Sheet>
    )
}
