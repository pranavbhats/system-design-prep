import { useEffect, useRef } from "react";

export const useEscapeKey = (isOpen: boolean, closeOnEscape: boolean, onClose: () => void) => {
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);
};

export const useClickOutside = (
    isOpen: boolean,
    closeOnClickOutside: boolean,
    onClose: () => void,
    ref: React.RefObject<HTMLElement | null>
) => {
    useEffect(() => {
        if (!isOpen || !closeOnClickOutside) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeOnClickOutside, onClose, ref]);
};

export const useFocusManagement = (isOpen: boolean, modalRef: React.RefObject<HTMLElement | null>) => {
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();
        } else {
            previousActiveElement.current?.focus();
        }
    }, [isOpen, modalRef]);
};

export const useBodyScrollLock = (isOpen: boolean) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
};
