import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import awsConfiguration from '../../config/awsConfigration';

const theme = createTheme();

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

export default function SignIn() {

  const [signInStatus, setSignInStatus] = React.useState(false);
  const [userName, setUserName] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    const autheticattionData = {
      Username: data.get('email'),
      Password: data.get('password')
    }
    const autheticattionDetails = new AuthenticationDetails(autheticattionData);

    const userData = {
      Username: data.get('email'),
      Pool: userPool
    }

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(autheticattionDetails, {
      onSuccess: (result) => {
        const idToken = result.getIdToken().getJwtToken();          // IDトークン
        const accessToken = result.getAccessToken().getJwtToken();  // アクセストークン
        const refreshToken = result.getRefreshToken().getToken();   // 更新トークン
        console.log("idToken : " + idToken);
        console.log("accessToken : " + accessToken);
        console.log("refreshToken : " + refreshToken);
        setSignInStatus(true);
        console.log(signInStatus);
        displayUserName();
      }, 
      onFailure: (error) => {
        console.log(error);
        setSignInStatus(false);
      }
    })
    displayUserName()
  };

  const displayUserName = () => {
    if (signInStatus) {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.getSession((error, session) => {
          if (error) {
            console.log(error);
          } else {
            cognitoUser.getUserAttributes((error, result) => {
              if (error) {
                console.log(error);
              } else {
                for (let i = 0; i < result.length; i++){
                  console.log(JSON.stringify(result[i]));
                }
              }
            })
          }
        })
      }
    }  
  }
  
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}