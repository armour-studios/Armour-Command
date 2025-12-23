"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
    MessageSquare,
    Heart,
    Share2,
    MoreHorizontal,
    Image as ImageIcon,
    Smile,
    Paperclip,
    Trophy,
    Users,
    Gamepad2,
    TrendingUp,
    Globe,
    Zap,
    Flame
} from "lucide-react"

export default function SocialPage() {
    const posts = [
        {
            id: 1,
            author: "Alex Rivera",
            handle: "@arivera_99",
            avatar: "/avatars/01.png",
            content: "Just secured the bag! 🏆 Taking our Valorant roster to the regional finals next month. Big things coming for Armour Nexus! #Esports #Valorant",
            likes: 24,
            comments: 5,
            timestamp: "2h ago",
            type: "update",
            game: "Valorant"
        },
        {
            id: 2,
            author: "Sarah Chen",
            handle: "@schen_design",
            avatar: "/avatars/02.png",
            content: "Does anyone have a good contact for custom jersey manufacturing? Looking for a new supplier for next season.",
            likes: 8,
            comments: 12,
            timestamp: "5h ago",
            type: "question"
        },
        {
            id: 3,
            author: "Marcus Johnson",
            handle: "@mj_coach",
            avatar: "/avatars/03.png",
            content: "Looking for a scrim partner for our Rocket League team. Diamond/Champ level. DM me!",
            likes: 3,
            comments: 1,
            timestamp: "1d ago",
            type: "lfg",
            game: "Rocket League"
        }
    ]

    const upcomingMatches = [
        { id: 1, game: "Valorant", opponent: "Cloud9 Academy", time: "Tonight, 8:00 PM", status: "Live" },
        { id: 2, game: "Rocket League", opponent: "G2 Next", time: "Tomorrow, 6:00 PM", status: "Scheduled" },
    ]

    const onlineFriends = [
        { id: 1, name: "DrDisrespect", status: "Playing Warzone", game: "Warzone" },
        { id: 2, name: "Shroud", status: "Streaming", game: "Valorant" },
        { id: 3, name: "Pokimane", status: "In Lobby", game: "League" },
    ]

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Zap className="h-8 w-8 text-rose-500" />
                        Social Hub
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Connect with the esports community</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="hidden sm:flex border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20">
                        <Trophy className="mr-2 h-4 w-4 text-rose-500" />
                        Tournament Stats
                    </Button>
                    <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700">
                        <Users className="mr-2 h-4 w-4" />
                        Find Players
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                {/* Main Feed Section (5 columns on desktop) */}
                <div className="md:col-span-4 lg:col-span-5 space-y-6">

                    {/* Post Input */}
                    <Card className="bg-slate-950 border-slate-800 hover:border-rose-500/20 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                <Avatar className="border-2 border-rose-500/20">
                                    <AvatarImage src="/avatars/01.png" />
                                    <AvatarFallback className="bg-rose-500/10 text-rose-500">ME</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                    <Input
                                        placeholder="Share your latest victory or find teammates..."
                                        className="bg-transparent border-none text-lg placeholder:text-slate-500 focus-visible:ring-0 px-0"
                                    />
                                    <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
                                                <ImageIcon className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                                                <Paperclip className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                                                <Smile className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button size="sm" className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white rounded-full px-6">
                                            Post
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feed Filters */}
                    <Tabs defaultValue="for-you" className="w-full">
                        <TabsList className="bg-slate-900/50 p-0 border-b border-slate-800 w-full justify-start rounded-none h-auto backdrop-blur">
                            <TabsTrigger value="for-you" className="rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:bg-transparent px-4 py-3 data-[state=active]:text-rose-500">
                                <Flame className="h-4 w-4 mr-2" />
                                For You
                            </TabsTrigger>
                            <TabsTrigger value="following" className="rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:bg-transparent px-4 py-3 data-[state=active]:text-rose-500">
                                Following
                            </TabsTrigger>
                            <TabsTrigger value="trending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:bg-transparent px-4 py-3 data-[state=active]:text-rose-500">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Trending
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="for-you" className="mt-6 space-y-4">
                            {posts.map((post) => (
                                <Card key={post.id} className="bg-slate-950 border-slate-800 hover:border-rose-500/20 transition-colors group">
                                    <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                                        <Avatar className="border-2 border-slate-800 group-hover:border-rose-500/20 transition-colors">
                                            <AvatarImage src={post.avatar} />
                                            <AvatarFallback>{post.author[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-white text-sm">{post.author}</span>
                                                <span className="text-slate-500 text-xs">{post.handle} · {post.timestamp}</span>
                                                {post.game && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                        {post.game}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 pb-4 space-y-4">
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            {post.content}
                                        </p>

                                        <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800/50">
                                            <Button variant="ghost" size="sm" className="hover:text-rose-500 hover:bg-rose-500/10 gap-2">
                                                <Heart className="h-4 w-4" />
                                                <span className="text-xs">{post.likes}</span>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="hover:text-blue-500 hover:bg-blue-500/10 gap-2">
                                                <MessageSquare className="h-4 w-4" />
                                                <span className="text-xs">{post.comments}</span>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="hover:text-green-500 hover:bg-green-500/10 gap-2">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Sidebar (2 columns on desktop) */}
                <div className="md:col-span-3 lg:col-span-2 space-y-6">
                    {/* Upcoming Matches */}
                    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur border-slate-800 hover:border-emerald-500/20 transition-colors">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <Gamepad2 className="h-4 w-4 text-emerald-500" />
                                Live & Upcoming
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {upcomingMatches.map(match => (
                                <div key={match.id} className="flex items-center justify-between border-l-2 border-emerald-500 pl-3 bg-emerald-500/5 p-2 rounded-r">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-white">{match.opponent}</span>
                                            {match.status === "Live" && (
                                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500">{match.game} · {match.time}</span>
                                    </div>
                                </div>
                            ))}
                            <Button variant="link" className="w-full text-xs text-emerald-400 h-auto p-0 hover:text-emerald-300">View Schedule</Button>
                        </CardContent>
                    </Card>

                    {/* Online Friends */}
                    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur border-slate-800 hover:border-blue-500/20 transition-colors">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-500" />
                                Online Now
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {onlineFriends.map(friend => (
                                <div key={friend.id} className="flex items-center justify-between hover:bg-slate-800/50 p-2 rounded-lg transition-colors cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-orange-500" />
                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-950" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{friend.name}</span>
                                            <span className="text-xs text-slate-500">{friend.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Trending Topics */}
                    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur border-slate-800 hover:border-rose-500/20 transition-colors">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-rose-500" />
                                Trending in Esports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1 hover:bg-slate-800/50 p-2 rounded-lg transition-colors cursor-pointer">
                                <p className="text-sm font-medium text-white leading-none">#VCTAmericas</p>
                                <p className="text-xs text-slate-500">12.5k posts</p>
                            </div>
                            <div className="space-y-1 hover:bg-slate-800/50 p-2 rounded-lg transition-colors cursor-pointer">
                                <p className="text-sm font-medium text-white leading-none">Rocket League</p>
                                <p className="text-xs text-slate-500">8.2k posts</p>
                            </div>
                            <div className="space-y-1 hover:bg-slate-800/50 p-2 rounded-lg transition-colors cursor-pointer">
                                <p className="text-sm font-medium text-white leading-none">New Agent Leak</p>
                                <p className="text-xs text-slate-500">5.1k posts</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
