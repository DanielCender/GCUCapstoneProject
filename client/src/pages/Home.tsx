import { useState } from 'react';
import { styled } from '@mui/system';
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'


const StyledButton = styled('button')`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;

&:hover {
  border-color: #646cff;
}

&:focus,
&:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
`;

const Home = () => {
    const [count, setCount] = useState(0)
    return (
        <>
        <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <StyledButton onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </StyledButton>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      </>
    )
}

export { Home };