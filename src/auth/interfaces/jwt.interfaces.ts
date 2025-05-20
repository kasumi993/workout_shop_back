// src/auth/interfaces/jwt.interfaces.ts

/**
 * Interface for JWT payload
 * This represents the data structure stored in the JWT token
 */
export interface JwtPayload {
  sub: string; // Subject (user ID)
  email: string; // User email
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}

/**
 * Interface for user data returned from JWT validation
 * This is what will be attached to the request.user property
 */
export interface JwtUser {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}
