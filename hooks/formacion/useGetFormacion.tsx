import { useState, useEffect } from "react";
import { getUsers } from "@/api/Usuarios/get";
import { UsersType } from "@/types";

export const useGetFormacion = () => {
  const [FormacionGrupo, setStudents] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getUsers();
        const FormacionGrupo = response.filter((profesor) => profesor.role === "formacion de grupo");
        setStudents(FormacionGrupo);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { FormacionGrupo, loading, error };
};