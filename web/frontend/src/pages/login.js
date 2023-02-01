import Head from 'next/head';
import NextLink from 'next/link';
import Router from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Link, TextField, Typography, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useAuthContext } from '../contexts/auth-context';
import { useUserContext } from '../contexts/user-context';

const Login = () => {
  const {login, logout, authAxios} = useAuthContext()
  const {setUser} = useUserContext()

  const loginRequest = async (values, actions) => axios
    .post(
      '/api/auth/login/',
      {
        username: values.email,
        password: values.password,
      },
      {withCredentials: true}
    )
    .then((response) => {
      // If login succeeded, update auth context and get the user info
      actions.setStatus(null)
      login(response.data.access)
      getUserInfo(actions)
    })
    .catch((error) => {
      let submissionError = ''
      if (error.response.status == 401) {
        submissionError = "No user found with this credential. Please check the email and password, then try again."
      } else {
        submissionError = "Something unexpected has happened, please try again."
      }
      actions.setStatus({submissionError})
    })

  const getUserInfo = async (actions) => authAxios
    .get('/api/userinfo/')
    .then((response) => {
      // If user info was retrieved successfully, redirect
      setUser(response.data)
      Router
        .replace({
          pathname: Router.query.continueUrl ? Router.query.continueUrl : '/',
        })
        .catch(console.error)
    })
    .catch(() => {
      // If user info failed to be retrieved, remove the auth context info
      logout()
      let submissionError = "Unable to retrieve your user information, please try again."
      actions.setStatus({submissionError})
    })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: loginRequest
  });

  return (
    <>
      <Head>
        <title>Login | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Dashboard
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                pb: 1,
                pt: 3
              }}
            >
              <Typography
                align="center"
                color="textSecondary"
                variant="body1"
              >
                Login with email address
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
              placeholder='Email'
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
              placeholder='Password'
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={!formik.isValid || formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Login Now
              </Button>
              {formik.status?.submissionError &&
                (
                  <Alert className='LoginError' severity='error'>
                    {formik.status?.submissionError}
                  </Alert>
                )
              }
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
