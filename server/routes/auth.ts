import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, "RANDOM-TOKEN") as JwtPayload;
    const user = decodedToken;
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};

export default authMiddleware;
