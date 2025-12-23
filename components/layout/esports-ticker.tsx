"use client"

import { Trophy, Circle } from "lucide-react"

export function EsportsTicker() {
    const matches = [
        { game: "Valorant", teams: "Cloud9 vs Sentinels", status: "LIVE", time: "Map 2" },
        { game: "Rocket League", teams: "G2 vs NRG", status: "LIVE", time: "Game 3" },
        { game: "CS2", teams: "FaZe vs Liquid", status: "Recent", time: "16-14" },
        { game: "League", teams: "T1 vs Gen.G", status: "Upcoming", time: "30min" },
        { game: "Valorant", teams: "100T vs EG", status: "Recent", time: "2-1" },
    ]

    return (
        <div className="bg-slate-950/50 backdrop-blur border-b border-slate-800 overflow-hidden">
            <div className="flex items-center gap-8 animate-scroll py-2 px-4">
                {/* Duplicate for seamless loop */}
                {[...matches, ...matches].map((match, i) => (
                    <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                        <Trophy className="h-3 w-3 text-rose-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-white">{match.game}</span>
                        <span className="text-xs text-slate-400">{match.teams}</span>
                        {match.status === "LIVE" && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                <Circle className="h-2 w-2 fill-red-500 text-red-500 animate-pulse" />
                                <span className="text-xs font-semibold text-red-400">LIVE</span>
                            </span>
                        )}
                        {match.status === "Recent" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                Final
                            </span>
                        )}
                        {match.status === "Upcoming" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Upcoming
                            </span>
                        )}
                        <span className="text-xs text-slate-500">{match.time}</span>
                    </div>
                ))}
            </div>
            <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
        </div>
    )
}
