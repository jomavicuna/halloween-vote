import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const participantsTable = base('Participants');
export const votesTable = base('Votes');

export interface Participant {
  id: string;
  name: string;
  photo: Array<{
    url: string;
    filename: string;
  }>;
  created_at: string;
}

export interface Vote {
  id: string;
  voter_name: string;
  voted_for: string[];
  created_at: string;
}
