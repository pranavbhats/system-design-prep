import { useRef, Children, isValidElement, cloneElement } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useEscapeKey, useClickOutside, useFocusManagement, useBodyScrollLock } from "./hooks/useModalEffects";
import { ModalHeader, ModalContent, ModalFooter } from "./components/ModalComposition";

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
    z-index: 1000;
`;

const ModalBackground = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 300px;
    max-width: 600px;
`;



type ControlledModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    closeOnEscape?: boolean;
    closeOnClickOutside?: boolean;
};

export const ControlledModal = ({
    isOpen,
    onClose,
    children,
    closeOnEscape = true,
    closeOnClickOutside = true,
}: ControlledModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEscapeKey(isOpen, closeOnEscape, onClose);
    useClickOutside(isOpen, closeOnClickOutside, onClose, modalRef);
    useFocusManagement(isOpen, modalRef);
    useBodyScrollLock(isOpen);

    if (!isOpen) return null;

    // Clone children and inject onClose to ModalHeader if present
    const enhancedChildren = Children.map(children, (child) => {
        if (isValidElement(child) && child.type === ModalHeader) {
            return cloneElement(child, { onClose } as Partial<typeof child.props>);
        }
        return child;
    });

    return createPortal(
        <ModalContainer role="dialog" aria-modal="true">
            <ModalBackground ref={modalRef} tabIndex={-1}>
                {enhancedChildren}
            </ModalBackground>
        </ModalContainer>,
        document.body
    );
};

// Export composition components
ControlledModal.Header = ModalHeader;
ControlledModal.Content = ModalContent;
ControlledModal.Footer = ModalFooter;
