'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Participant {
  id: string;
  name: string;
  photo: Array<{
    url: string;
    filename: string;
  }>;
}

interface Vote {
  id: string;
  voter_name: string;
  voted_for: string[];
}

interface ParticipantWithVotes extends Participant {
  voteCount: number;
  rank: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<ParticipantWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();

    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchResults, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      const [participantsRes, votesRes] = await Promise.all([
        fetch('/api/participants'),
        fetch('/api/votes'),
      ]);

      if (!participantsRes.ok || !votesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const participants: Participant[] = await participantsRes.json();
      const votes: Vote[] = await votesRes.json();

      // Count votes for each participant
      const voteCounts = new Map<string, number>();
      votes.forEach((vote) => {
        const participantId = vote.voted_for[0];
        voteCounts.set(participantId, (voteCounts.get(participantId) || 0) + 1);
      });

      // Add vote counts to participants
      const participantsWithVotes = participants.map((participant) => ({
        ...participant,
        voteCount: voteCounts.get(participant.id) || 0,
        rank: 0,
      }));

      // Sort by vote count (descending)
      participantsWithVotes.sort((a, b) => b.voteCount - a.voteCount);

      // Assign ranks (handle ties)
      let currentRank = 1;
      participantsWithVotes.forEach((participant, index) => {
        if (index > 0 && participant.voteCount < participantsWithVotes[index - 1].voteCount) {
          currentRank = index + 1;
        }
        participant.rank = currentRank;
      });

      setResults(participantsWithVotes);
      setError('');
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-foreground/70">Loading results...</p>
      </div>
    );
  }

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

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
            Live Results
          </h1>
          <p className="text-foreground/70">
            Rankings update every 5 seconds
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">No votes yet!</p>
            <Link
              href="/vote"
              className="inline-block mt-4 text-sm font-medium"
              style={{ color: '#0B6E4F' }}
            >
              Be the first to vote →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-foreground/10 bg-white shadow-sm"
              >
                <div className="flex-shrink-0 text-2xl font-bold w-12 text-center">
                  {getRankEmoji(participant.rank)}
                </div>

                <div className="flex-shrink-0">
                  <img
                    src={participant.photo?.[0]?.url || '/placeholder.png'}
                    alt={participant.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {participant.name}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {participant.voteCount} {participant.voteCount === 1 ? 'vote' : 'votes'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/vote"
            className="flex-1 text-center py-3 px-6 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: '#0B6E4F' }}
          >
            Vote Now
          </Link>
          <button
            onClick={fetchResults}
            className="px-6 py-3 rounded-lg border-2 font-medium transition-colors"
            style={{ borderColor: '#0B6E4F', color: '#0B6E4F' }}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
