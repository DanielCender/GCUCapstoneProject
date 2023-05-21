import { FunctionComponent, PropsWithChildren } from 'react'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import { useUserContext } from '../../state/UserContext'
import { useNavContext } from '../../state/NavContext'
import { PALETTE } from '../../palette'

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

const SceneWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { authenticated, logout } = useUserContext()
  const { setCurrentPage } = useNavContext()
  const worldId = localStorage.getItem('worldId')
  const worldName = localStorage.getItem('worldName')
  return (
    <PageContainer>
      <StyledMenuBar>
        <div>{/* Empty div for alignment */}</div>
        <HomeTitle type="button" onClick={() => setCurrentPage('home')} disabled={!!worldId}>
          {worldName ?? 'Little Offices'}
        </HomeTitle>
        <StyledButtonGroup>
          {!authenticated ? (
            <HeaderButton variant="contained" onClick={() => setCurrentPage('login')}>
              Login
            </HeaderButton>
          ) : (
            <>
              {worldId ? (
                <HeaderButton
                  variant="contained"
                  onClick={() => {
                    localStorage.removeItem('worldId')
                    localStorage.removeItem('worldName')
                    // todo: Make call to /world/:worldId/leave
                    setCurrentPage('worldselect')
                  }}
                >
                  Leave World
                </HeaderButton>
              ) : (
                <HeaderButton
                  variant="contained"
                  onClick={() => {
                    setCurrentPage('worldselect')
                  }}
                >
                  Worlds
                </HeaderButton>
              )}
              <HeaderButton
                variant="text"
                onClick={() => {
                  logout()
                  setCurrentPage('home')
                }}
              >
                Logout
              </HeaderButton>
            </>
          )}
          <HeaderButton
            variant="outlined"
            href="https://github.com/DanielCender/GCUCapstoneProject"
          >
            About
          </HeaderButton>
        </StyledButtonGroup>
      </StyledMenuBar>
      <PageContents>{children}</PageContents>
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

export { SceneWrapper }
