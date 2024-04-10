import { Request, Response, NextFunction } from 'express';

export const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.adminUserId) {
    return next();
  }
  return res.status(401).json({ error: 'You must be logged in as an admin to access this resource' });
};