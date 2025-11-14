import { type ReactNode } from 'react';
import styled from 'styled-components';

interface ControlledStepperProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  children: ReactNode;
}

interface StepProps {
  children: ReactNode;
}

// Styled Components
const StepperContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 600px;
  margin: 20px auto;
`;

const StepIndicatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
`;

const StepWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const StepButton = styled.button<{ $isActive: boolean; $isCompleted: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: ${props => 
    props.$isActive ? '#007bff' : props.$isCompleted ? '#28a745' : '#e0e0e0'
  };
  color: ${props => (props.$isActive || props.$isCompleted) ? 'white' : '#666'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const StepConnector = styled.div<{ $isCompleted: boolean }>`
  flex: 1;
  height: 2px;
  background-color: ${props => props.$isCompleted ? '#28a745' : '#e0e0e0'};
  margin: 0 10px;
`;

const StepContent = styled.div`
  min-height: 200px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const NavButton = styled.button<{ $disabled: boolean; $variant: 'previous' | 'next' }>`
  padding: 10px 20px;
  background-color: ${props => {
    if (props.$disabled) return '#ccc';
    return props.$variant === 'previous' ? '#6c757d' : '#007bff';
  }};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-weight: bold;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const StepCounter = styled.div`
  color: #666;
  align-self: center;
`;

export const ControlledStepper = ({ 
  currentStep, 
  totalSteps, 
  onStepChange, 
  children 
}: ControlledStepperProps) => {
  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    onStepChange(step);
  };

  return (
    <StepperContainer>
      {/* Step Indicator */}
      <StepIndicatorContainer>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <StepWrapper key={stepNumber}>
              <StepButton
                onClick={() => handleStepClick(stepNumber)}
                $isActive={isActive}
                $isCompleted={isCompleted}
              >
                {isCompleted ? '✓' : stepNumber}
              </StepButton>
              {stepNumber < totalSteps && (
                <StepConnector $isCompleted={isCompleted} />
              )}
            </StepWrapper>
          );
        })}
      </StepIndicatorContainer>

      {/* Step Content */}
      <StepContent>
        {children}
      </StepContent>

      {/* Navigation Buttons */}
      <NavigationContainer>
        <NavButton
          onClick={handlePrevious}
          disabled={currentStep === 1}
          $disabled={currentStep === 1}
          $variant="previous"
        >
          Previous
        </NavButton>
        
        <StepCounter>
          Step {currentStep} of {totalSteps}
        </StepCounter>

        <NavButton
          onClick={handleNext}
          disabled={false}
          $disabled={false}
          $variant="next"
        >
          {currentStep === totalSteps ? 'Finish' : 'Next'}
        </NavButton>
      </NavigationContainer>
    </StepperContainer>
  );
};

// Step component for organizing content
ControlledStepper.Step = ({ children }: StepProps) => {
  return <div>{children}</div>;
};
