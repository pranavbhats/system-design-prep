import styled from "styled-components";
import React, { useMemo, memo } from "react";

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

const LeftSidebar = memo(({ width, children }: LeftSidebarProps) => (
    <LeftSidebarContainer width={width}>{children}</LeftSidebarContainer>
));

LeftSidebar.displayName = 'SplitScreen.LeftSidebar';

const RightSidebar = memo(({ width, children }: RightSidebarProps) => (
    <RightSidebarContainer width={width}>{children}</RightSidebarContainer>
));

RightSidebar.displayName = 'SplitScreen.RightSidebar';

const BottomPanel = memo(({ height, children }: BottomPanelProps) => (
    <BottomPanelContainer height={height}>{children}</BottomPanelContainer>
));

BottomPanel.displayName = 'SplitScreen.BottomPanel';

const MainContent = memo(({ children }: MainContentProps) => (
    <MainContentContainer>{children}</MainContentContainer>
));

MainContent.displayName = 'SplitScreen.MainContent';

type SplitScreenComponent = React.FC<SplitScreenProps> & {
    LeftSidebar: typeof LeftSidebar;
    RightSidebar: typeof RightSidebar;
    BottomPanel: typeof BottomPanel;
    MainContent: typeof MainContent;
};

const SplitScreenRoot: React.FC<SplitScreenProps> = ({ children }) => {
    // Memoize child filtering to avoid unnecessary re-computation
    const { leftSidebar, rightSidebar, bottomPanel, mainContent } = useMemo(() => {
        const childrenArray = React.Children.toArray(children);

        return {
            leftSidebar: childrenArray.find(
                (child) => React.isValidElement(child) && child.type === LeftSidebar
            ),
            rightSidebar: childrenArray.find(
                (child) => React.isValidElement(child) && child.type === RightSidebar
            ),
            bottomPanel: childrenArray.find(
                (child) => React.isValidElement(child) && child.type === BottomPanel
            ),
            mainContent: childrenArray.find(
                (child) => React.isValidElement(child) && child.type === MainContent
            ),
        };
    }, [children]);

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

SplitScreenRoot.displayName = 'SplitScreen';

export const SplitScreen = SplitScreenRoot as SplitScreenComponent;

SplitScreen.LeftSidebar = LeftSidebar;
SplitScreen.RightSidebar = RightSidebar;
SplitScreen.BottomPanel = BottomPanel;
SplitScreen.MainContent = MainContent;