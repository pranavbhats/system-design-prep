import React from "react";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { cloneChildrenWithProps } from "./utils/cloneChildrenWithProps";

export const CurrentUserInfoLoader = ({ children }: { children: React.ReactNode }) => {
    const { currentUser, loading, error } = useCurrentUser();

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!currentUser) return <div>No user data available</div>;

    return <>{cloneChildrenWithProps(children, { user: currentUser })}</>;
}