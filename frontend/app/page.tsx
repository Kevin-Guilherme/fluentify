export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Fluentify
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Learn languages with AI-powered conversations
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl font-bold hover:scale-105 transition-all"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
