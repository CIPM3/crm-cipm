import { useState, useEffect } from "react";
import { getUsers } from "@/api/Usuarios/get";
import { UsersType } from "@/types";

export const useGetAgendadores = () => {
  const [Agendadores, setStudents] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getUsers();
        const Agendadores = response.filter((profesor) => profesor.role === "agendador");
        setStudents(Agendadores);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { Agendadores, loading, error };
};