import styled from "styled-components";

const Header = styled.div`
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

type ModalHeaderProps = {
    title: string;
    showCloseButton: boolean;
    onClose: () => void;
};

export const ModalHeader = ({ title, showCloseButton, onClose }: ModalHeaderProps) => (
    <Header>
        <Title>{title}</Title>
        {showCloseButton && (
            <CloseButton onClick={onClose} aria-label="Close modal">
                ✕
            </CloseButton>
        )}
    </Header>
);
