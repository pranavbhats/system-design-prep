import { UncontrolledForm } from './UncontrolledForm'
import { ControlledForm } from './ControlledForm'
import { ControlledModal } from './ControlledModal'
import { StepperExample } from './StepperExample'
import { useState } from 'react';
function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    console.log("Saved!");
    setIsOpen(false);
  };
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <UncontrolledForm />

      <ControlledModal isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnEscape={true} closeOnClickOutside={true}>
        <ControlledModal.Header showCloseButton>
          My Modal Title
        </ControlledModal.Header>

        <ControlledModal.Content>
          <ControlledForm
            initialName="test"
            initialAge="22"
            initialEmail="test@gmail.com"
            onSubmit={handleSave}
          />
        </ControlledModal.Content>

        <ControlledModal.Footer>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </ControlledModal.Footer>
      </ControlledModal>
      <button onClick={handleOpenModal}>Open Modal</button>
      <StepperExample />
    </>
  )
}

export default App
