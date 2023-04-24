import { Fragment, FunctionComponent, PropsWithChildren } from 'react';
import { styled } from '@mui/system';


const StyledRow = styled(Fragment)`
  display: flex;
  flex-direction: row;
`;

export const Row: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return (
        <StyledRow>{children}</StyledRow>
    )
}