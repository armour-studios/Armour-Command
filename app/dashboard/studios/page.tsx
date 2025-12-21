'use client'

export default function StudiosPage() {
    return (
        <div className="h-full flex flex-col">
            <div className="p-8 pb-4">
                <h1 className="text-3xl font-bold text-white mb-2">Armour Studios</h1>
                <p className="text-slate-400">Order professional services directly from your command center.</p>
            </div>
            <div className="flex-1 bg-white">
                <iframe
                    src="https://armour-studios.com"
                    className="w-full h-full border-none"
                    title="Armour Studios Store"
                />
            </div>
        </div>
    )
}
