'use client'

import { useState } from 'react'
import { generateImage } from '@/app/actions/image-generation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Image as ImageIcon, Download } from 'lucide-react'
import Image from 'next/image'

export function ImageGenerator({ organizationId }: { organizationId: string }) {
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!prompt) return
        setIsGenerating(true)
        setGeneratedImage(null)

        try {
            const result = await generateImage({
                organization_id: organizationId,
                prompt,
                image_type: 'custom'
            })

            if (result.success && result.image) {
                setGeneratedImage(result.image.url)
            } else {
                alert('Failed: ' + result.error)
            }
        } catch (error) {
            alert('Error generating image')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <ImageIcon className="h-5 w-5 text-purple-500" />
                    AI Asset Generator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Describe the image you want (e.g., 'futuristic esport jersey design')..."
                        className="bg-slate-800 border-slate-700 text-white"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
                    </Button>
                </div>

                {generatedImage && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 relative group">
                        <Image
                            src={generatedImage}
                            alt="Generated asset"
                            width={1024}
                            height={1024}
                            className="w-full h-auto"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="secondary" asChild>
                                <a href={generatedImage} download target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download High Res
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
