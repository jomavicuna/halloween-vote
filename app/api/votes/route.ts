import { NextRequest, NextResponse } from 'next/server';
import { votesTable } from '@/lib/airtable';

export async function GET() {
  try {
    const records = await votesTable.select().all();

    const votes = records.map(record => ({
      id: record.id,
      voter_name: record.get('voter_name'),
      voted_for: record.get('voted_for'),
      created_at: record.get('created_at'),
    }));

    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voter_name, voted_for } = body;

    if (!voter_name || !voted_for) {
      return NextResponse.json(
        { error: 'Voter name and voted_for are required' },
        { status: 400 }
      );
    }

    // Check if this voter has already voted
    const existingVotes = await votesTable
      .select({
        filterByFormula: `{voter_name} = '${voter_name.replace(/'/g, "\\'")}'`,
      })
      .firstPage();

    if (existingVotes.length > 0) {
      return NextResponse.json(
        { error: 'You have already voted' },
        { status: 400 }
      );
    }

    // Create the vote
    const record = await votesTable.create({
      voter_name,
      voted_for: [voted_for],
    });

    return NextResponse.json({
      id: record.id,
      voter_name: record.get('voter_name'),
      voted_for: record.get('voted_for'),
    });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    );
  }
}
