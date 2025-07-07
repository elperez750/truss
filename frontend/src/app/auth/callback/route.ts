import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'


// This is the code that is used to handle the callback from the auth provider

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding/additional-details'
  
  // Enhanced logging for debugging
  console.log("=== AUTH CALLBACK DEBUG ===")
  console.log("Full URL:", request.url)
  console.log("Search params:", Object.fromEntries(searchParams.entries()))
  console.log("Code:", code)
  console.log("Next:", next)
  console.log("Origin:", origin)
  
  // Check for error parameters (common in OAuth failures)
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  if (error) {
    console.log("OAuth Error:", error)
    console.log("Error Description:", errorDescription)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`)
  }

  if (code) {
    console.log("Processing auth code...")
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log("Successfully exchanged code for session")
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.log("Error exchanging code for session:", error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_failed`)
    }
  }

  console.log("No code parameter found, redirecting to error page")
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}