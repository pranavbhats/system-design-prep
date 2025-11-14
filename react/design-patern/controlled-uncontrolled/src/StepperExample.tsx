import { useState } from 'react';
import { ControlledStepper } from './ControlledStepper';

export const StepperExample = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    console.log(`Navigated to step ${step}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2>Step 1: Personal Information</h2>
            <p>Please enter your personal details.</p>
            <input type="text" placeholder="Full Name" style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
            <input type="email" placeholder="Email" style={{ width: '100%', padding: '8px' }} />
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: Address Details</h2>
            <p>Please provide your address information.</p>
            <input type="text" placeholder="Street Address" style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
            <input type="text" placeholder="City" style={{ width: '100%', padding: '8px' }} />
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Payment Information</h2>
            <p>Enter your payment details.</p>
            <input type="text" placeholder="Card Number" style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
            <input type="text" placeholder="CVV" style={{ width: '100%', padding: '8px' }} />
          </div>
        );
      case 4:
        return (
          <div>
            <h2>Step 4: Review & Confirm</h2>
            <p>Please review your information before submitting.</p>
            <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '4px' }}>
              <p><strong>✓ Personal Information Complete</strong></p>
              <p><strong>✓ Address Details Complete</strong></p>
              <p><strong>✓ Payment Information Complete</strong></p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Controlled Stepper Example</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        The parent component controls the current step ({currentStep}) and total steps ({totalSteps})
      </p>
      
      <ControlledStepper
        currentStep={currentStep}
        totalSteps={totalSteps}
        onStepChange={handleStepChange}
      >
        {renderStepContent()}
      </ControlledStepper>

      <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        <p>Current Step State: {currentStep}</p>
      </div>
    </div>
  );
};
