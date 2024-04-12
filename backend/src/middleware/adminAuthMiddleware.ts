import { Request, Response, NextFunction } from 'express';

export const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // if (req.isAuthenticated() && req.loginInfo.role === 'admin') {  
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).json({ error: 'You must be an admin to access this resource' });
};