import React from "react";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { cloneChildrenWithProps } from "./utils/cloneChildrenWithProps";
import { useData } from "./hooks/useData";

export const ResourceLoader = ({ resourceUrl, resourceType, children }: { resourceUrl: string; resourceType: string; children: React.ReactNode }) => {
    const { data, loading, error } = useData(resourceUrl, resourceType);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!data) return <div>No data available</div>;

    return <>{cloneChildrenWithProps(children, {
        [resourceType]: data,
    })}</>;
}