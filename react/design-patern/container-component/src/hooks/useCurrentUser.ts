import { useEffect, useState } from "react";
import axios from "axios";
import type { User } from "../UserInfo";

export const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get<User>('/api/current-user');
                if (isMounted) {
                    setCurrentUser(response.data);
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

        fetchCurrentUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return { currentUser, loading, error };
};
