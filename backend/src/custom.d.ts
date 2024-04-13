import 'express-session';

declare module 'express-session' {
  interface SessionData {
    passport: any;
  }
}

// need further investigation
declare namespace Express {
  interface Request {
    isAuthenticated(): boolean;
    isTest: boolean;
    loginInfo: {
      _id: string;
      name: string;
      email: string;
      role: string;
      // Add any other properties of the user object
    };
  }
}