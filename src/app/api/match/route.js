import matcher from '@/app/lib/match';
import { NextResponse } from 'next/server';
export async function POST(req, res) {
  try {
    const { resumeText, jdText } = await req.json();
    console.log("Received resume text:", resumeText, jdText);
    const results = {
      score: 78,
      matchedSkills: ['JavaScript', 'React', 'Node.js'],
      unmatchedSkills: ['Python', 'Django']
    };
    const outputObj = await matcher(resumeText, jdText);
    return NextResponse.json(outputObj);
  } catch (error) {
    console.error('Error processing match:', error);
    if(error.message === "No valid JSON found."){
      return NextResponse.json({ error: 'Failed to extract.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to process match' }, { status: 500 });
  }
}