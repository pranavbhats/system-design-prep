import { useEffect, useState } from "react";
import axios from "axios";
import type { User } from "../UserInfo";

export const useUser = (id: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const response = await axios.get<User>(`/api/users/${id}`);
                if (isMounted) {
                    setUser(response.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch user');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, [id]);

    return { user, loading, error };
};
