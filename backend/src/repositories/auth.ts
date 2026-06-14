import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { pool } from '../db/pool.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'rentrent-dev-secret';
const JWT_EXPIRES_IN = '7d';

type UserRow = {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  password_hash: string | null;
  initial: string;
  verified_since: string;
  role: string;
};

function toPublicUser(row: UserRow) {
  return {
    name: row.name,
    email: row.email,
    mobile: row.mobile ?? undefined,
    initial: row.initial,
    verifiedSince: row.verified_since,
    role: row.role,
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
  const existing = await pool.query('SELECT id FROM users WHERE email = $1 OR mobile = $2', [
    email,
    mobile,
  ]);
  if (existing.rowCount) {
    throw new Error('Email or mobile already registered');
  }

  const name = nameFromEmail(email);
  const initial = name.charAt(0).toUpperCase();
  const passwordHash = await bcrypt.hash(password, 10);
  const verifiedSince = new Date().getFullYear().toString();

  const result = await pool.query<UserRow>(
    `INSERT INTO users (name, email, mobile, password_hash, initial, verified_since, role)
     VALUES ($1, $2, $3, $4, $5, $6, 'user')
     RETURNING id, name, email, mobile, password_hash, initial, verified_since, role`,
    [name, email, mobile, passwordHash, initial, verifiedSince],
  );

  const user = result.rows[0];
  return { token: signToken(user.id), user: toPublicUser(user) };
}

export async function loginUser(email: string, password: string) {
  const result = await pool.query<UserRow>(
    `SELECT id, name, email, mobile, password_hash, initial, verified_since, role
     FROM users WHERE email = $1`,
    [email],
  );

  const user = result.rows[0];
  if (!user?.password_hash) {
    throw new Error('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  return { token: signToken(user.id), user: toPublicUser(user) };
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
  const result = await pool.query<{ role: string }>('SELECT role FROM users WHERE id = $1', [
    userId,
  ]);
  return result.rows[0]?.role ?? null;
}
