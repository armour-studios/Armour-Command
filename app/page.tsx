import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LayoutDashboard, Shield } from "lucide-react"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black selection:bg-rose-500/30">
            <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-rose-500 opacity-20 blur-[100px]"></div>
            </div>

            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
                    <Shield className="h-4 w-4 text-rose-500" />
                    <span className="text-muted-foreground">The Operating System for Esports</span>
                </div>

                <h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                    Manage your organization <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                        like a pro
                    </span>
                </h1>

                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Armour Nexus provides the tools you need to manage rosters, scrims, branding, and finances in one unified platform.
                </p>

                <div className="flex gap-4 mt-8">
                    <Link href="/auth">
                        <Button size="lg" className="gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 border-0">
                            Get Started <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" size="lg" className="gap-2 backdrop-blur-sm">
                            <LayoutDashboard className="h-4 w-4" />
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-8 text-sm text-muted-foreground/50">
                © 2024 Armour Studios. All rights reserved.
            </div>
        </main>
    )
}
