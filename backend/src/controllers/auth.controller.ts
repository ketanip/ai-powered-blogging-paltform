// Express
import { Request, Response } from "express";

// Validation
import { z } from "zod";
import argon2 from "argon2";
import { AuthValidation } from "../validation";

// Models
import UserModel from "../models/user.model";

// Services
import { createJWTToken } from "../services/jwt.service";
import { fromError } from "zod-validation-error";


const signUp = async (req: Request, res: Response) => {

    try {

        const data = await AuthValidation.signUp.parseAsync(req.body);
        const existingUser = await UserModel.findOne({ email: data.email });
        if (existingUser) {
            res.status(409).json({ error: "User already exists, please login." });
            return;
        }

        const newUser = await UserModel.create({
            name: data.name,
            email: data.email,
            password: data.password,
        });

        const jwtToken = createJWTToken(newUser);
        res.json({ jwt_token: jwtToken, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
        return;

    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationError = fromError(error).toString();
            res.status(401).json({ error: validationError });
            return;
        }

        console.error("Failed to sign up.");
        console.error(error);
        res.status(500).json({ error: "Failed to sign up. Please try again in 5 minutes." });
        return;
    }

}

const signIn = async (req: Request, res: Response) => {

    try {

        const data = await AuthValidation.signIn.parseAsync(req.body);
        const existingUser = await UserModel.findOne({ email: data.email });
        if (!existingUser) {
            res.status(404).json({ error: "User does not exists, please create account." });
            return;
        }

        const isValidPassword = await argon2.verify(existingUser.password, data.password);

        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid email or password." });
            return;
        }

        const jwtToken = createJWTToken(existingUser);
        res.json({ jwt_token: jwtToken, user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, } });
        return;

    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationError = fromError(error).toString();
            res.status(403).json({ error: validationError }); return;
        }

        console.error("Failed to sign in.");
        console.error(error);
        res.status(500).json({ error: "Failed to sign in. Please try again in 5 minutes." });
        return;
    }

}

export {
    signUp,
    signIn
}