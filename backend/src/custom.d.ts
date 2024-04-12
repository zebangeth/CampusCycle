import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string | null;
    adminUserId: string | null;
  }
}

declare namespace Express {
  interface Request {
    isAuthenticated(): boolean;
    isAdmin(): boolean;
    loginInfo: {
      _id: string;
      name: string;
      email: string;
      role: string;
      // Add any other properties of the user object
    };
  }
}