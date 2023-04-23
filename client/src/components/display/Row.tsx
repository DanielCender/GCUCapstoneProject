import React from 'react';
import { styled } from '@mui/system';


const StyledRow = styled(React.Fragment)`
  display: flex;
  flex-direction: row;
`;

export const Row: React.FC = ({ children }) => {
    return (
        <StyledRow>{children}</StyledRow>
    )
}