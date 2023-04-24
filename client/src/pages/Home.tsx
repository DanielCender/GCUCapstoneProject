import { styled } from '@mui/system';
import secondaryImg from '../assets/charlesdeluvio-home-hands.jpg';
import { PageWrapper } from '../components/PageWrapper';

const CallToActionWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`

const TextActionBox = styled('div')`
  flex: 1;
  margin: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
`

const TextBlock = styled('p')`
  display: block;
  flex: 1;
  font-size: 1.5rem;
  font-weight: 500;
  font-family: Roboto, sans-serif;
  align-self: flex-start;
  text-align: left;
`

const SecondaryImage = styled('img')`
background-size: cover; 
width: 200px;
  height: 300px;
  object-fit: cover;
flex: 1;
`

const StyledList = styled('ul')`
display: block;
flex: 1;
font-size: 1.5rem;
font-weight: 500;
font-family: Roboto, sans-serif;
align-self: flex-start;
text-align: left;
list-style: inside;
`;


const Home = () => {
    return (
      <PageWrapper>
        <CallToActionWrapper>
          <TextActionBox>
        <TextBlock>{`
        Little Offices is a digital workspace for the disconnected, a social watering hole for the distant, and a meeting space for those unmet.
        `}  
        </TextBlock>
        <TextBlock>
        {`We combined state-of-the-art transmission standards for vocal communications over the web with traditional text and visual mediums, crafting a space where creators and learners can all access their ideal methods for channeling new ideas.`}
        </TextBlock>
        </TextActionBox>
        <SecondaryImage src={secondaryImg} />
        <TextActionBox>
          <StyledList>
            Current stable features:
            <li>Text chat</li>
            <li>Private World Spaces</li>
          </StyledList>
          <StyledList>
            Coming Soon!:
            <li>Voice chat</li>
            <li>Digital Whiteboard</li>
            <li>Interactable Virtual Environment</li>
          </StyledList>
          <TextBlock>{`Create an account and start collaborating today!`}</TextBlock>
        </TextActionBox>
        </CallToActionWrapper>
        </PageWrapper>
    )
}

export { Home };