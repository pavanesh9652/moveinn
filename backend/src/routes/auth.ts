import { Router } from 'express';

import { loginUser, signupUser } from '../repositories/auth.js';

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  try {
    const { email, mobile, password } = req.body as {
      email?: string;
      mobile?: string;
      password?: string;
    };

    if (!email?.trim() || !mobile?.trim() || !password) {
      res.status(400).json({ error: 'Email, mobile, and password are required' });
      return;
    }

    const result = await signupUser(email.trim().toLowerCase(), mobile.trim(), password);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign up failed';
    res.status(400).json({ error: message });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email?.trim() || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await loginUser(email.trim().toLowerCase(), password);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ error: message });
  }
});
