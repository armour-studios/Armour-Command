import { AuthForm } from '@/components/auth/auth-form'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Armour Nexus</h1>
          <p className="text-slate-400">Esports Organization Operating System</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
