import { createContext, useContext, useState, useEffect, useRef, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalBackground = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ModalOpenButton = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const CloseButton = styled.button`
    padding: 5px 10px;
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
`;

type ModalContextType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("Modal compound components must be used within Modal");
    }
    return context;
};

// Hook for handling click outside
const useClickOutside = (ref: React.RefObject<HTMLElement | null>, handler: () => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

// Hook for handling escape key
const useEscapeKey = (handler: () => void, isActive: boolean) => {
    useEffect(() => {
        if (!isActive) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handler();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [handler, isActive]);
};

type ModalProps = {
    children: React.ReactNode;
};

type ModalHeaderProps = {
    children: React.ReactNode;
    showCloseButton?: boolean;
};

type ModalContentProps = {
    children: React.ReactNode;
};

type ModalFooterProps = {
    children: React.ReactNode;
};

type ModalOpenButtonProps = {
    children: React.ReactNode;
};

type ModalDialogProps = {
    children: React.ReactNode;
};

const ModalHeader = memo(({ children, showCloseButton }: ModalHeaderProps) => {
    const { close } = useModalContext();
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>{children}</h2>
            {showCloseButton && (
                <CloseButton onClick={close} aria-label="Close modal">
                    Close
                </CloseButton>
            )}
        </div>
    );
});

ModalHeader.displayName = 'Modal.Header';

const ModalContent = memo(({ children }: ModalContentProps) => {
    return <div style={{ margin: '20px 0' }}>{children}</div>;
});

ModalContent.displayName = 'Modal.Content';

const ModalFooter = memo(({ children }: ModalFooterProps) => {
    return <div>{children}</div>;
});

ModalFooter.displayName = 'Modal.Footer';

const ModalOpenButtonComponent = memo(({ children }: ModalOpenButtonProps) => {
    const { open } = useModalContext();
    return (
        <ModalOpenButton onClick={open}>
            {children}
        </ModalOpenButton>
    );
});

ModalOpenButtonComponent.displayName = 'Modal.OpenButton';

const ModalDialog = memo(({ children }: ModalDialogProps) => {
    const { isOpen, close } = useModalContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Handle click outside
    useClickOutside(modalRef, close);

    // Handle escape key
    useEscapeKey(close, isOpen);

    // Focus management
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();
        } else {
            previousActiveElement.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <ModalContainer role="dialog" aria-modal="true">
            <ModalBackground ref={modalRef} tabIndex={-1}>
                {children}
            </ModalBackground>
        </ModalContainer>,
        document.body
    );
});

ModalDialog.displayName = 'Modal.Dialog';

type ModalComponent = React.FC<ModalProps> & {
    Header: typeof ModalHeader;
    Content: typeof ModalContent;
    Footer: typeof ModalFooter;
};

const ModalRoot: React.FC<ModalProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const contextValue = useCallback(
        () => ({ isOpen, open, close }),
        [isOpen, open, close]
    );

    return (
        <ModalContext.Provider value={contextValue()}>
            <ModalOpenButtonComponent> Open Modal </ModalOpenButtonComponent>
            <ModalDialog>
                {children}
            </ModalDialog>
        </ModalContext.Provider>
    );
};

ModalRoot.displayName = 'Modal';

export const Modal = ModalRoot as ModalComponent;

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;