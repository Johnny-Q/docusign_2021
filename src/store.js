import { atom, selector } from "recoil";
import { verifyToken, logout } from "./logic/auth";

export const tokenState = atom({
    key: "tokenState",
    default: window.localStorage.getItem("token") ?? null
})

export const loggedInState = selector({
    key: "isLoggedIn",
    get: async ({ get }) => {
        const token = get(tokenState);
        if (token) {
            return await verifyToken();
        } else {
            logout();
            return false;
        }
    }
})