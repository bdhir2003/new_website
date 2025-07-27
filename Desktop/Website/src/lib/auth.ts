import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const generateToken = (payload: UserPayload): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.verify(token, secret) as DecodedToken;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Alias for backward compatibility
export const verifyPassword = comparePassword;

export function getTokenFromRequest(request: NextRequest): string | null {
  // First check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Then check for token in cookies
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie?.value) {
    return tokenCookie.value;
  }
  
  return null;
}

export function isAdmin(user: DecodedToken | null): boolean {
  return Boolean(user && user.role === 'admin');
}
