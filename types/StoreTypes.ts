import { UsersType } from ".";

export interface AuthState {
    user: UsersType | null;
    setUser: (user: UsersType) => void;
    clearUser: () => void;
}
