import { DB_COLLECCTIONS } from "@/lib/constants";
import { loginUser as loginUserService, fetchItem } from "@/lib/firebaseService";
import { LoginUserData, UsersType } from "@/types";

export const loginUser = async ({ email, password }: LoginUserData): Promise<UsersType> => {
    const userCredential = await loginUserService(email, password);
    const user = userCredential.user;
  
    const userData = await fetchItem<UsersType>(DB_COLLECCTIONS.USUARIOS, user.uid);
    return userData;
  };