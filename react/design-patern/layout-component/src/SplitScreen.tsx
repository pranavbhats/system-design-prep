import styled from "styled-components";
import React from "react";

const LayoutContainer = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
`;

const LeftSidebarContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || '250px'};
    background-color: #252526;
    border-right: 1px solid #1e1e1e;
    overflow-y: auto;
`;

const MainArea = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
`;

const MainContentContainer = styled.div`
    flex: 1;
    overflow: auto;
    background-color: #1e1e1e;
`;

const BottomPanelContainer = styled.div<{ height?: string }>`
    height: ${props => props.height || '200px'};
    background-color: #252526;
    border-top: 1px solid #1e1e1e;
    overflow-y: auto;
`;

const RightSidebarContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || '250px'};
    background-color: #252526;
    border-left: 1px solid #1e1e1e;
    overflow-y: auto;
`;

type LeftSidebarProps = {
    width?: string;
    children: React.ReactNode;
};

type RightSidebarProps = {
    width?: string;
    children: React.ReactNode;
};

type BottomPanelProps = {
    height?: string;
    children: React.ReactNode;
};

type MainContentProps = {
    children: React.ReactNode;
};

type SplitScreenProps = {
    children: React.ReactNode;
};

const LeftSidebar = ({ width, children }: LeftSidebarProps) => (
    <LeftSidebarContainer width={width}>{children}</LeftSidebarContainer>
);

const RightSidebar = ({ width, children }: RightSidebarProps) => (
    <RightSidebarContainer width={width}>{children}</RightSidebarContainer>
);

const BottomPanel = ({ height, children }: BottomPanelProps) => (
    <BottomPanelContainer height={height}>{children}</BottomPanelContainer>
);

const MainContent = ({ children }: MainContentProps) => (
    <MainContentContainer>{children}</MainContentContainer>
);

export const SplitScreen = ({ children }: SplitScreenProps) => {
    const childrenArray = React.Children.toArray(children);

    const leftSidebar = childrenArray.find(
        (child) => React.isValidElement(child) && child.type === LeftSidebar
    );
    const rightSidebar = childrenArray.find(
        (child) => React.isValidElement(child) && child.type === RightSidebar
    );
    const bottomPanel = childrenArray.find(
        (child) => React.isValidElement(child) && child.type === BottomPanel
    );
    const mainContent = childrenArray.find(
        (child) => React.isValidElement(child) && child.type === MainContent
    );

    return (
        <LayoutContainer>
            {leftSidebar}
            <MainArea>
                {mainContent}
                {bottomPanel}
            </MainArea>
            {rightSidebar}
        </LayoutContainer>
    );
};

SplitScreen.LeftSidebar = LeftSidebar;
SplitScreen.RightSidebar = RightSidebar;
SplitScreen.BottomPanel = BottomPanel;
SplitScreen.MainContent = MainContent;