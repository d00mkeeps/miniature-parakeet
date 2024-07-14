import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post('http://localhost:8000/parse_timeframe', body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error in parse-timeframe route:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}