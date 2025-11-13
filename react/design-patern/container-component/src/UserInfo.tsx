import styled from 'styled-components';

const Card = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    max-width: 400px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-family: Arial, sans-serif;
`;

const Title = styled.h2`
    margin-top: 0;
    color: #333;
`;

const InfoRow = styled.div`
    margin-bottom: 10px;
`;

const HobbiesList = styled.ul`
    margin-top: 5px;
    padding-left: 20px;
`;
export interface User {
    name: string,
    hairColor: string,
    age: number,
    hobbies: string[]
}
type UserInfoProps = {
    user?: User
}

export const UserInfo = ({ user }: UserInfoProps) => {
    if (!user) {
        throw new Error('UserInfo requires a user prop. Use it within CurrentUserInfo container.');
    }
    
    const { name, hairColor, age, hobbies } = user;
    
    return (
        <Card>
            <Title>{name}</Title>
            <InfoRow>
                <strong>Age:</strong> {age}
            </InfoRow>
            <InfoRow>
                <strong>Hair Color:</strong> {hairColor}
            </InfoRow>
            <div>
                <strong>Hobbies:</strong>
                <HobbiesList>
                    {hobbies.map((hobby, index) => (
                        <li key={index}>{hobby}</li>
                    ))}
                </HobbiesList>
            </div>
        </Card>
    );
}