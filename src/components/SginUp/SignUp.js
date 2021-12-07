import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js'
import awsConfiguration from '../../config/awsConfigration';

const theme = createTheme();

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

export default function SignUp() {

  const [signUpStatus, setSignUpStatus] = React.useState(false);
  const [activateStatus, setActivateStatus] = React.useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    const attributeList = [
      new CognitoUserAttribute({
        Name: "given_name",
        Value: data.get('firstName'),
      }),
      new CognitoUserAttribute({
        Name: "family_name",
        Value: data.get('lastName'),
      })
    ];

    userPool.signUp(
      data.get('email'), 
      data.get('password'), 
      attributeList, 
      null, 
      (err) => {
        if (err) {
          setSignUpStatus(false);
          return;
        }
        setSignUpStatus(true);
      }
    );
  };

  const activateUser = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userDataForActivation = {
      Username : data.get('email'),
      Pool : userPool
    };
    const cognitoUser = new CognitoUser(userDataForActivation);
    cognitoUser.confirmRegistration(data.get('code'),
      true,
      (err) => {
        if (err) {
          setActivateStatus(false);
          return;
        }
        setActivateStatus(true);
      })
      window.alert('ユーザー認証' + activateStatus);
  }

  if (!signUpStatus){
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
  if (signUpStatus) {
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
          <Box component="form" onSubmit={activateUser} noValidate sx={{ mt: 1 }}>
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
              name="code"
              label="Activation Code"
              type="text"
              id="code"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Activate Your Account
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    )
  }
  return (
    <div>
      Loading...
    </div>
  )
}