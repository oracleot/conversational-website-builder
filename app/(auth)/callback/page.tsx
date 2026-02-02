'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/db/client';

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent double execution in React Strict Mode
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        const supabase = createBrowserClient();
        
        // First, check if user is already authenticated (handles Strict Mode re-runs)
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          router.push('/');
          router.refresh();
          return;
        }
        
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check for error in URL (e.g., expired or already used link)
        const errorParam = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
        
        if (errorParam) {
          throw new Error(errorDescription || errorParam);
        }
        
        // Check if we have a code in the URL (for PKCE flow)
        const code = searchParams.get('code');
        
        if (code) {
          // Exchange the code for a session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            // If exchange fails, check if we already have a session (code was consumed by first render)
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              router.push('/');
              router.refresh();
              return;
            }
            throw exchangeError;
          }
        } else {
          // Fallback: check for hash parameters (older flow)
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (sessionError) throw sessionError;
          } else {
            throw new Error('No authentication code or tokens found in URL');
          }
        }

        // Verify the session was established
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) throw new Error('Failed to establish session');

        // Redirect to home
        router.push('/');
        router.refresh();
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <a href="/login" className="text-primary hover:underline">
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Signing you in...</h1>
        <p className="text-muted-foreground">Please wait a moment</p>
      </div>
    </div>
  );
}
