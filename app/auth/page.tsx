'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Handle error (e.g., show toast)
        console.error("Login failed:", result.error);
        alert("Login failed. For demo, use demo@example.com / password123");
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'discord') => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-2">
            <Shield className="h-6 w-6 text-rose-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900/50 border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900/50 border-zinc-800"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign In with Email
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-950 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleOAuthLogin('google')} className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuthLogin('discord')} className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.48 13.48 0 0 0-.81 1.666c-2.147-.322-4.29-.322-6.402 0-.256-.63-.52-1.18-.842-1.63a.076.076 0 0 0-.077-.041 19.825 19.825 0 0 0-4.891 1.513.076.076 0 0 0-.038.053C.387 9.88.583 15.228 1.94 20.447a.066.066 0 0 0 .046.046 6.848 6.848 0 0 0 2.853 1.405.068.068 0 0 0 .076-.027 13.725 13.725 0 0 1 1.053-1.674.074.074 0 0 0-.041-.106 10.966 10.966 0 0 1-1.644-.793.064.064 0 0 1-.004-.108 8.019 8.019 0 0 0 .313-.243.069.069 0 0 1 .074-.008c4.322 1.972 9.006 1.972 13.256 0a.068.068 0 0 1 .075.008 7.394 7.394 0 0 0 .315.242.064.064 0 0 1-.004.109c-.54.298-1.096.564-1.655.798a.074.074 0 0 0-.04.106 14.12 14.12 0 0 1 1.055 1.673.064.064 0 0 0 .074.027 6.839 6.839 0 0 0 2.859-1.407.067.067 0 0 0 .044-.044c1.47-5.597 1.39-10.978-.65-16.03a.075.075 0 0 0-.038-.052zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Discord
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-rose-500 transition-colors">
            Back to Home
          </Link>
          <div className="text-xs">
            Demo: demo@example.com / password123
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
