export interface JwtPayload {
    id: string;
    name: string;
    email: string;
}

declare global {
    namespace Express {
        interface Response {
            locals: {
                user: JwtPayload | undefined;
            };
        }
    }
}
