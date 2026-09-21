import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const dataDirectory = path.join(process.cwd(), 'data');
const waitlistFile = path.join(dataDirectory, 'waitlist.json');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Subscriber = { email: string; subscribedAt: string };

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    return JSON.parse(await readFile(waitlistFile, 'utf8')) as Subscriber[];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json() as { email?: unknown };
  } catch {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const subscribers = await readSubscribers();
  if (subscribers.some((subscriber) => subscriber.email === email)) {
    return NextResponse.json({ message: 'You are already on the list.' });
  }

  subscribers.push({ email, subscribedAt: new Date().toISOString() });
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(waitlistFile, JSON.stringify(subscribers, null, 2) + '\n', 'utf8');
  return NextResponse.json({ message: 'You are on the list.' }, { status: 201 });
}
