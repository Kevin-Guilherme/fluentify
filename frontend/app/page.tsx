import { Logo } from '@/components/layout/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-950 via-blue-950/30 to-purple-950/30">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        {/* Logo + Brand */}
        <div className="flex justify-center mb-8">
          <Logo variant="logomark" animate size={56} />
        </div>

        <p className="text-xl text-gray-300 mb-8">
          Learn languages with AI-powered conversations
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/signup"
            className="px-8 py-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl font-bold text-white hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-gray-200 hover:bg-slate-700 hover:border-slate-600 hover:scale-105 transition-all duration-300"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
  );
}
