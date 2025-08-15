import { registerUser as registerUserService, setItem } from "@/lib/firebaseService";
import { RegisterUserData, UsersType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const createUser = async ({ name, email, password, role }: RegisterUserData): Promise<UsersType> => {
    const userCredential = await registerUserService(email, password, name);
    const user = userCredential.user;

    const UserData: UsersType = {
        id: user.uid,
        name,
        email,
        role,
        avatar: "",
        createdAt: new Date().toISOString(),
    };

    await setItem<UsersType>(DB_COLLECCTIONS.USUARIOS, user.uid, UserData);
    return UserData;
};