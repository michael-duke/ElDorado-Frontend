import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from '@material-tailwind/react';
import {
  Field, Form, Formik, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { signUp, allMessages, allStatus } from '../redux/Auth/authSlice';
import useToken from '../redux/Auth/useToken';
import Alert from './Alert';
import { Spinner } from './Loader';

const Register = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .matches(
        /^(?=.{4,50}$)(?![a-z])(?!.*[_.]{2})[a-zA-Z ]+(?<![_.])$/,
        'Name should have at least 4 characters and should not contain numbers or special characters/punctuations!',
      )
      .required('Name is required!'),
    email: Yup.string().required('Email is required!').email('Invalid Email!'),
    password: Yup.string()
      .required('Password is required!')
      .matches(
        /^[a-zA-Z0-9!@#$%^&* ]{6,20}$/,
        'Password must contain at least 6 characters!',
      ),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password not match!')
      .required('Confirm Password is required!'),
  });
  const message = useSelector(allMessages);
  const status = useSelector(allStatus);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const isTokenSet = useToken();

  const handleSignUp = (user) => {
    dispatch(signUp(user));
  };

  useEffect(() => {
    if (isTokenSet) navigate('/');
  }, [isTokenSet]);

  document.title = 'ElDorado | Register';
  return (
    <>
      {status === 'failed' && <Alert message={message} />}
      <Card className="w-96 mt-5 mx-auto bg-white/90 backdrop-blur-md">
        <CardHeader
          variant="gradient"
          color="amber"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography
            variant="h3"
            color="white"
            className="font-osans uppercase tracking-widest font-light"
          >
            Register
          </Typography>
        </CardHeader>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSignUp}
          validationSchema={SignupSchema}
        >
          {({
            errors, touched, dirty, isValid,
          }) => (
            <Form>
              <CardBody className="flex flex-col gap-4">
                <Field
                  as={Input}
                  color="amber"
                  name="name"
                  label="Name"
                  size="lg"
                  error={Boolean(errors.name) && Boolean(touched.name)}
                />
                <ErrorMessage
                  name="name"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
                <Field
                  as={Input}
                  color="amber"
                  name="email"
                  label="Email"
                  size="lg"
                  error={Boolean(errors.email) && Boolean(touched.email)}
                />
                <ErrorMessage
                  name="email"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
                <Field
                  as={Input}
                  color="amber"
                  type="password"
                  name="password"
                  label="Password"
                  size="lg"
                  error={Boolean(errors.password) && Boolean(touched.password)}
                />
                <ErrorMessage
                  name="password"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
                <Field
                  as={Input}
                  color="amber"
                  type="password"
                  name="passwordConfirmation"
                  label="Confirm Password"
                  size="lg"
                  error={
                    Boolean(errors.passwordConfirmation)
                    && Boolean(touched.passwordConfirmation)
                  }
                />
                <ErrorMessage
                  name="passwordConfirmation"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  color="amber"
                  variant="gradient"
                  className="flex justify-center items-center"
                  fullWidth
                  type="submit"
                  disabled={!isValid || !dirty}
                >
                  {status === 'loading' ? <Spinner /> : <span>Register</span>}
                </Button>
                <Typography
                  variant="small"
                  className="mt-6 flex justify-center"
                >
                  Have have an account?
                  <NavLink
                    to="/login"
                    className="ml-1 font-bold hover:text-gray-600 text-amber-700"
                  >
                    Sign in
                  </NavLink>
                </Typography>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default Register;
