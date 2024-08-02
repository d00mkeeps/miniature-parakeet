import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post('http://localhost:8000/improve_goal', body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error in improve-goal route:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}