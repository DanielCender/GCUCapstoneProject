import * as React from 'react'
import { styled } from '@mui/system'

const urlPrefix = `https://wbo.ophir.dev/boards/`

const WhiteboardWrapper = styled('div')`
  margin: ${({ theme }: any) => theme.spacing(1)};
  flex: 9;
  border-radius: 15px;
  height: 100%;
  iframe {
    width: 100%;
    height: 100%;
    background: #fff;
  }
`

export const Whiteboard: React.FunctionComponent = () => {
  const whiteboardUrl = `${urlPrefix}capstone-little-offices-world-${localStorage.getItem(
    'worldId'
  )}`

  return (
    <WhiteboardWrapper>
      <iframe title="white board" src={whiteboardUrl} />
    </WhiteboardWrapper>
  )
}
