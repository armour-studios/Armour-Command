'use client'

import { ImageGenerator } from '@/components/dashboard/image-generator'

export default function ImageGenPage() {
    const demoOrgId = '00000000-0000-0000-0000-000000000000'

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">AI Studio</h1>
            <div className="max-w-3xl">
                <ImageGenerator organizationId={demoOrgId} />
            </div>
        </div>
    )
}
