import { NextRequest, NextResponse } from 'next/server';
import { participantsTable } from '@/lib/airtable';

export async function GET() {
  try {
    const records = await participantsTable.select().all();

    const participants = records.map(record => ({
      id: record.id,
      name: record.get('name'),
      photo: record.get('photo'),
      created_at: record.get('created_at'),
    }));

    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const photo = formData.get('photo') as File;

    if (!name || !photo) {
      return NextResponse.json(
        { error: 'Name and photo are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer for Airtable
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Create record using REST API directly to handle attachments
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Participants`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            name,
            photo: [
              {
                url: `data:${photo.type};base64,${base64}`,
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API error:', errorData);
      throw new Error('Failed to create record in Airtable');
    }

    const data = await response.json();

    return NextResponse.json({
      id: data.id,
      name: data.fields.name,
      photo: data.fields.photo,
    });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json(
      { error: 'Failed to create participant' },
      { status: 500 }
    );
  }
}
