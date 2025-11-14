import styled from "styled-components";

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 1.5rem;
`;

const CloseButton = styled.button`
    padding: 5px 10px;
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
        background-color: #c82333;
    }
`;

const ContentContainer = styled.div`
    margin: 20px 0;
`;

const FooterContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
`;

// Composition Components
type ModalHeaderProps = {
    children: React.ReactNode;
    showCloseButton?: boolean;
    onClose?: () => void;
};

export const ModalHeader = ({ children, showCloseButton, onClose }: ModalHeaderProps) => (
    <HeaderContainer>
        {typeof children === 'string' ? <Title>{children}</Title> : children}
        {showCloseButton && onClose && (
            <CloseButton onClick={onClose} aria-label="Close modal">
                ✕
            </CloseButton>
        )}
    </HeaderContainer>
);

type ModalContentProps = {
    children: React.ReactNode;
};

export const ModalContent = ({ children }: ModalContentProps) => (
    <ContentContainer>{children}</ContentContainer>
);

type ModalFooterProps = {
    children: React.ReactNode;
};

export const ModalFooter = ({ children }: ModalFooterProps) => (
    <FooterContainer>{children}</FooterContainer>
);
