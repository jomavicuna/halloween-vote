import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Halloween Vote
          </h1>
          <p className="text-lg text-foreground/70">
            Vote for the best costume!
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/register"
            className="block w-full py-4 px-6 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: '#0B6E4F' }}
          >
            Register Your Costume
          </Link>

          <Link
            href="/vote"
            className="block w-full py-4 px-6 rounded-lg border-2 font-medium transition-colors hover:bg-foreground/5"
            style={{ borderColor: '#0B6E4F', color: '#0B6E4F' }}
          >
            Vote Now
          </Link>

          <Link
            href="/results"
            className="block w-full py-4 px-6 rounded-lg border-2 font-medium transition-colors hover:bg-foreground/5"
            style={{ borderColor: '#0B6E4F', color: '#0B6E4F' }}
          >
            View Results
          </Link>
        </div>
      </div>
    </div>
  );
}
