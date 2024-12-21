import { z } from "zod";

const signUp = z.object({
    name: z.string().min(2, { message: "Minimum 2 characters required." }),
    email: z.string().email({ message: "Valid email required." }),
    password: z.string().min(8, { message: "Minimum 8 characters required." }),
});

const signIn = z.object({
    title: z.string().min(10, { message: "Minimum 10 characters required." }),
    blog: z.string().min(100, { message: "Minimum 100 characters required." }),
});

export {
    signUp,
    signIn,
}