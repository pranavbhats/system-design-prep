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

const Price = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #2c5f2d;
    margin-bottom: 15px;
`;

const Description = styled.p`
    color: #666;
    line-height: 1.5;
    margin-bottom: 15px;
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
`;

const Stars = styled.span`
    color: #ffa500;
    font-weight: bold;
`;

type ProductInfoProps = {
    product?: {
        id: string;
        name: string;
        price: string;
        description: string;
        rating: number;
    }
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
    if (!product) {
        throw new Error('ProductInfo requires a product prop. Use it within ResourceLoader container.');
    }
    const { name, price, description, rating } = product;
    
    return (
        <Card>
            <Title>{name}</Title>
            <Price>{price}</Price>
            <Description>{description}</Description>
            <Rating>
                <strong>Rating:</strong>
                <Stars>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</Stars>
                <span>{rating}/5</span>
            </Rating>
        </Card>
    );
}