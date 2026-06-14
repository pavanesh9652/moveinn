import { randomUUID } from 'crypto';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { getDb } from '../db/mongo.js';
import type { UserDoc } from '../db/types.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'rentrent-dev-secret';
const JWT_EXPIRES_IN = '7d';

function toPublicUser(user: UserDoc) {
  return {
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    initial: user.initial,
    verifiedSince: user.verifiedSince,
    role: user.role,
  };
}

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function nameFromEmail(email: string) {
  const local = email.split('@')[0] ?? 'User';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export async function signupUser(email: string, mobile: string, password: string) {
  const db = await getDb();
  const users = db.collection<UserDoc>('users');

  const existing = await users.findOne({ $or: [{ email }, { mobile }] });
  if (existing) {
    throw new Error('Email or mobile already registered');
  }

  const name = nameFromEmail(email);
  const initial = name.charAt(0).toUpperCase();
  const passwordHash = await bcrypt.hash(password, 10);
  const verifiedSince = new Date().getFullYear().toString();
  const id = randomUUID();

  const user: UserDoc = {
    _id: id,
    name,
    email,
    mobile,
    passwordHash,
    initial,
    verifiedSince,
    role: 'user',
    createdAt: new Date(),
  };

  await users.insertOne(user);

  return { token: signToken(id), user: toPublicUser(user) };
}

export async function loginUser(email: string, password: string) {
  const db = await getDb();
  const users = db.collection<UserDoc>('users');

  const user = await users.findOne({ email });
  if (!user?.passwordHash) {
    throw new Error('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  return { token: signToken(user._id), user: toPublicUser(user) };
}

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
}

export async function getUserRole(userId: string): Promise<string | null> {
  const db = await getDb();
  const user = await db.collection<UserDoc>('users').findOne(
    { _id: userId },
    { projection: { role: 1 } },
  );
  return user?.role ?? null;
}
