import { fetchItems } from "@/lib/firebaseService";
import { UsersType } from '@/types';
import { DB_COLLECCTIONS } from '@/lib/constants';

export const getUsers = async (): Promise<UsersType[]> => {
    return await fetchItems<UsersType>(DB_COLLECCTIONS.USUARIOS);
};