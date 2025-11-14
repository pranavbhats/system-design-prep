import { useRef } from "react";
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

export const UncontrolledForm = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const ageRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(nameRef.current?.value);
        console.log(ageRef.current?.value);
        console.log(emailRef.current?.value);
    };
    return (
      <StyledForm onSubmit={handleSubmit}>
      <Heading>Uncontrolled Form</Heading>
      
      <FormGroup>
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" ref={nameRef}/>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="age">Age</Label>
        <Input type="number" id="age" ref={ageRef}/>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" ref={emailRef}/>
      </FormGroup>

      <SubmitButton type="submit">Submit</SubmitButton>
    </StyledForm>
  );
};