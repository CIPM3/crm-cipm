import { useState, useEffect } from "react";
import { getUsers } from "@/api/Usuarios/get";
import { UsersType } from "@/types";

export const useGetInstructores = () => {
  const [Instructores, setStudents] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getUsers();
        const Instructores = response.filter((profesor) => profesor.role === "instructor");
        setStudents(Instructores);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { Instructores, loading, error };
};