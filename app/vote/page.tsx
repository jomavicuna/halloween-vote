'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Participant {
  id: string;
  name: string;
  photo: Array<{
    url: string;
    filename: string;
  }>;
}

export default function VotePage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [voterName, setVoterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/participants');
      if (!response.ok) throw new Error('Failed to fetch participants');
      const data = await response.json();
      setParticipants(data);
    } catch (err) {
      setError('Failed to load participants');
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedParticipant || !voterName) {
      setError('Please select a costume and enter your name');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voter_name: voterName,
          voted_for: selectedParticipant,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vote');
      }

      router.push('/results');
    } catch (err: any) {
      setError(err.message || 'Failed to submit vote. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-foreground/70">Loading costumes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-block text-sm font-medium"
            style={{ color: '#0B6E4F' }}
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Vote for Best Costume
          </h1>
          <p className="text-foreground/70">
            Select your favorite costume and submit your vote
          </p>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">No costumes registered yet!</p>
            <Link
              href="/register"
              className="inline-block mt-4 text-sm font-medium"
              style={{ color: '#0B6E4F' }}
            >
              Be the first to register →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {participants.map((participant) => (
                <button
                  key={participant.id}
                  type="button"
                  onClick={() => setSelectedParticipant(participant.id)}
                  className={`relative rounded-lg overflow-hidden border-4 transition-all ${
                    selectedParticipant === participant.id
                      ? 'border-[#0B6E4F] scale-95'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={participant.photo?.[0]?.url || '/placeholder.png'}
                    alt={participant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                    <p className="text-sm font-medium truncate">
                      {participant.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="voterName" className="block text-sm font-medium text-foreground">
                Your Name
              </label>
              <input
                id="voterName"
                type="text"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                placeholder="Enter your name to vote"
                className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-[#0B6E4F] focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedParticipant}
              className="w-full py-4 px-6 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0B6E4F' }}
            >
              {loading ? 'Submitting...' : 'Submit Vote'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
