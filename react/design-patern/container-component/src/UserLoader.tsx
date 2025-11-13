import React from "react";
import { useUser } from "./hooks/useUser";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { cloneChildrenWithProps } from "./utils/cloneChildrenWithProps";

export const UserLoader = ({ userId, children }: { userId: string; children: React.ReactNode }) => {
    const { user, loading, error } = useUser(userId);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!user) return <div>No user data available</div>;

    return <>{cloneChildrenWithProps(children, { user })}</>;
}