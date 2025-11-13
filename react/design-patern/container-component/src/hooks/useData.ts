import { useEffect, useState } from "react";
import axios from "axios";
import type { User } from "../UserInfo";

export const useData = (resourceUrl: string, resourceType: string) => {
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get<User>(`/api/${resourceUrl}`);
                if (isMounted) {
                    setData(response.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : `Failed to fetch ${resourceType}`);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [resourceType, resourceUrl]);

    return { data, loading, error };
};
