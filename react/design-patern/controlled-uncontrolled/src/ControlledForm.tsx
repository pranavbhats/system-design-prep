import { useState } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }

  &:hover {
    border-color: #b0b0b0;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #357abd;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Heading = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  text-align: center;
`;

interface ControlledFormProps {
  initialName?: string;
  initialAge?: string;
  initialEmail?: string;
  onSubmit?: (data: { name: string; age: string; email: string }) => void;
}

export const ControlledForm = ({ 
  initialName = "", 
  initialAge = "", 
  initialEmail = "",
  onSubmit 
}: ControlledFormProps) => {
    const [name, setName] = useState(initialName);
    const [age, setAge] = useState(initialAge);
    const [email, setEmail] = useState(initialEmail);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ name, age, email });
        onSubmit?.({ name, age, email });
    };
    return (
      <StyledForm onSubmit={handleSubmit}>
      <Heading>Controlled Form</Heading>
      
      <FormGroup>
        <Label htmlFor="name">Name</Label>
        <Input 
          type="text" 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="age">Age</Label>
        <Input 
          type="number" 
          id="age" 
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input 
          type="email" 
          id="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>

      <SubmitButton type="submit">Submit</SubmitButton>
    </StyledForm>
  );
};