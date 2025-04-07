const express = require('express');
const jwt = require('jsonwebtoken');

type Request = typeof express.Request;
type Response = typeof express.Response;
type NextFunction = typeof express.NextFunction;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
