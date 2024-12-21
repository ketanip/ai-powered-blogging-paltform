import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { CONFIG } from '../common/config';
import { JwtPayload } from '../types/types';


export const createJWTToken = (user: IUser) => {
    const payload: JwtPayload = {
        id: user._id as string,
        name: user.name,
        email: user.email
    };

    return jwt.sign({payload}, CONFIG.JWT.JWT_SECRET, { expiresIn: CONFIG.JWT.JWT_EXPIRES_IN });
};


export const validateJWTToken = (token: string) => {
    try {
        const payload = jwt.verify(token, CONFIG.JWT.JWT_SECRET);
        return { valid: true, payload };
    } catch (error: any) {
        return { valid: false, error: error.message };
    }
};
