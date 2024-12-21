import jwt from 'jsonwebtoken';
import { CONFIG } from '../common/config';
import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log(token)
        if (!token) {
            res.status(403).json({ error: 'No token provided' });
            return;
        }

        const data: any = jwt.verify(token, CONFIG.JWT.JWT_SECRET);
        res.locals.user = data.payload;
        next();
        return;

    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }

};

export default authMiddleware;
