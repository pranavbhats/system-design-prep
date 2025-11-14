import { type ComponentType } from 'react';

export const printProps = <P extends object>(WrappedComponent: ComponentType<P>) => {
    return function PrintPropsWrapper(props: P) {
        console.log(props);
        return <WrappedComponent {...props} />;
    };
};