import { FunctionComponent, PropsWithChildren } from 'react'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import heroImage from '../assets/dylan-nolte-home-hero.jpg'
import { useUserContext } from '../state/UserContext'
import { useNavContext } from '../state/NavContext'
import { PALETTE } from '../palette'

const headerHeight = 80
const footerHeight = 80

const PageContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  background-color: ${PALETTE['Raspberry rose']};
`

const StyledMenuBar = styled('div')`
  height: ${headerHeight}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & div {
    flex: 1;
  }
`

const HomeTitle = styled('button')`
  font-family: Ariel, sans-serif;
  font-weight: 400;
  font-style: italic;
  color: ${PALETTE['Non Photo blue']};
  text-shadow: 2px 2px 5px ${PALETTE['Sunset']};
  outline: none;
  background: none;
  border: none;
  height: 80px;
  font-size: 3rem;
  cursor: pointer;
`

const StyledButtonGroup = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const HeaderButton = styled(Button)`
  margin-right: 20px;
`

const PageContents = styled('div')`
  height: calc(100% - ${headerHeight + footerHeight}px);
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`

const HeroImage = styled('img')`
  width: 100%;
  max-width: 100%;
  height: 350px;
  object-fit: cover;
`

const Footer = styled('footer')`
  height: ${footerHeight}px;
  display: flex;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const PageWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { authenticated, logout } = useUserContext()
  const { setCurrentPage } = useNavContext()
  return (
    <PageContainer>
      <StyledMenuBar>
        <div>{/* Empty div for alignment */}</div>
        <HomeTitle type="button" onClick={() => setCurrentPage('home')}>
          Little Offices
        </HomeTitle>
        <StyledButtonGroup>
          {!authenticated ? (
            <HeaderButton variant="contained" onClick={() => setCurrentPage('login')}>
              Login
            </HeaderButton>
          ) : (
            <HeaderButton
              variant="contained"
              onClick={() => {
                logout()
                setCurrentPage('home')
              }}
            >
              Logout
            </HeaderButton>
          )}
          <HeaderButton
            variant="outlined"
            href="https://github.com/DanielCender/GCUCapstoneProject"
          >
            About
          </HeaderButton>
        </StyledButtonGroup>
      </StyledMenuBar>
      <PageContents>
        <HeroImage src={heroImage} alt="Office Hero Image; Photo by Dylan Nolte on Unsplash" />
        {children}
      </PageContents>
      <Footer>
        <div style={{ marginLeft: '28px' }}>
          Copyright by Daniel Cender {new Date().getFullYear()}
        </div>
        <div>
          <HeaderButton href="https://github.com/DanielCender" color="primary">
            GitHub
          </HeaderButton>
          <HeaderButton href="https://www.linkedin.com/in/daniel-cender-887871142/" color="info">
            LinkedIn
          </HeaderButton>
        </div>
      </Footer>
    </PageContainer>
  )
}

export { PageWrapper }
