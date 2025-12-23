import { Sidebar } from "@/components/layout/sidebar"
import { UserNav } from "@/components/layout/user-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { EsportsTicker } from "@/components/layout/esports-ticker"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Shield } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth is handled by Middleware

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar (Desktop) */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Esports Ticker */}
        <EsportsTicker />

        {/* Header (Mobile Trigger + User Nav) */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/50 backdrop-blur-xl px-4 md:px-6">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div className="md:hidden flex items-center">
              <Shield className="h-6 w-6 text-rose-500 mr-2" />
              <span className="font-bold">Armour</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
