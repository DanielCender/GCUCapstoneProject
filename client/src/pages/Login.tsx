import { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import TextField from '@mui/material/TextField';
import { useNavContext } from '../state/NavContext';
import { Row } from '../components/display/Row';

const formHeight = 400;

const FormModal = styled('div')`
    position: relative;
    width: 400px;
    height: 350px;
    top: calc(50% - ${formHeight}px);
    margin-left: auto;
    margin-right: auto;
    padding: 10px 25px;
    background-color: purple;
    border-radius: 25px;
    margin: 2rem 2rem;
`

export const Login = () => {
    const { setCurrentPage } = useNavContext();

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setError(null)

        if (username == '') {
            setError('Username must be set')
            return;
        }
        if (password == '') {
            setError('Must input password')
            return;
        }

        const data = {
            username,
            password,
        };


        try {
            console.log('source: ', import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL)
            const response = await fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
        
            const result = await response.json();

            if(response.status !== 200) {
                setError(result.message)
                return;
            }

            console.log("Response:", result);
            setCurrentPage('worldselect');
          } catch (error) {
            console.error("Error:", error);
          }
    }

    return (
        <PageWrapper>
            <FormModal>
            <form autoComplete="off" onSubmit={handleSubmit}>
            <h2>Login</h2>
                <TextField 
                    label="Username"
                    onChange={(e: any) => setUsername(e.target.value)}
                    required
                    variant="outlined"
                    color="secondary"
                    type="text"
                    sx={{mb: 3}}
                    fullWidth
                    value={username}
                 />
                 <TextField 
                    label="Password"
                    onChange={(e: any) => setPassword(e.target.value)}
                    required
                    variant="outlined"
                    color="secondary"
                    type="password"
                    value={password}
                    fullWidth
                    sx={{mb: 3}}
                 />
                 {error && (
                   <Alert severity="error">
                   <AlertTitle>Error</AlertTitle>
                   {error}
                 </Alert>
                 )}
                 <Row>
                 <Button variant="contained" color="secondary" type="submit">Login</Button>
                 </Row>
                 <Row>
                 <Button variant="outlined" color="secondary" type="button" onClick={() => {
                     setCurrentPage('signup');
                    }}>Sign Up</Button>
                    </Row>
        </form>
            </FormModal>
        </PageWrapper>
    )
}