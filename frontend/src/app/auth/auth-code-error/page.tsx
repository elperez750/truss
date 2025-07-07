'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
    const searchParams = useSearchParams()
    
    // Get all URL parameters
    const allParams = Object.fromEntries(searchParams.entries())
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Authentication Error
                    </h1>
                    
                    <p className="text-gray-600 mb-6">
                        There was an issue with the authentication process.
                    </p>
                    
                    {/* Debug information */}
                    <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(allParams, null, 2)}
                        </pre>
                    </div>
                    
                    {/* Specific error messages */}
                    {searchParams.get('error') && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                            <p className="text-red-700 text-sm">
                                <strong>Error:</strong> {searchParams.get('error')}
                            </p>
                            {searchParams.get('description') && (
                                <p className="text-red-700 text-sm mt-1">
                                    <strong>Description:</strong> {searchParams.get('description')}
                                </p>
                            )}
                        </div>
                    )}
                    
                    <div className="space-y-3">
                        <Link href="/authenticate">
                            <Button className="w-full">
                                Try Again
                            </Button>
                        </Link>
                        
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Go Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
                </div>
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    )
} 