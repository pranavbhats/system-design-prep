import React from "react";

export const cloneChildrenWithProps = (
    children: React.ReactNode,
    props: Record<string, unknown>
) => {
    return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, props);
        }
        return child;
    });
};
