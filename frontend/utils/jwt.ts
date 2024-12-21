const getJWTToken = () => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken) throw new Error("No jwt token set.");
    return jwtToken;
}

const setJWTToken = (jwt_token: string) => {
    localStorage.setItem("jwt_token", jwt_token);
}

interface AuthUser {
    id: string,
    name: string,
    email: string
}

const getUser = () => {

    const rawAuthUser = localStorage.getItem("auth_user");
    if (!rawAuthUser) throw new Error("Now auth user set.");
    return JSON.parse(rawAuthUser) as AuthUser || {};
}

const setUser = (user: AuthUser) => {
    return localStorage.setItem("auth_user", JSON.stringify(user));
}

const isLoggedIn = () => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken) return false;
    return true;
}

const logout = () =>  {
    localStorage.clear()
}

export const TokenManger = {
    getJWTToken,
    setJWTToken,
    getUser,
    setUser,
    isLoggedIn,
    logout,
}