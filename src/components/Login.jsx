import React, { useState, useEffect } from 'react';
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
import { signIn, allStatus, allMessages } from '../redux/Auth/authSlice';
import useToken from '../redux/Auth/useToken';
import Alert from './Alert';
import { Spinner } from './Loader';

const Login = () => {
  const [user, setUser] = useState({});
  const status = useSelector(allStatus);
  const message = useSelector(allMessages);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isTokenSet = useToken();

  const handleChange = (e) => {
    const {
      target: { name: input, value },
    } = e;
    setUser({ ...user, [input]: value });
  };

  const handleSignIn = () => dispatch(signIn(user));

  useEffect(() => {
    if (isTokenSet) navigate('/');
  }, [isTokenSet]);

  document.title = 'ElDorado | Login';
  return (
    <>
      {status === 'unauthorized' && <Alert message={message} />}
      <Card className="mt-5 max-w-sm mx-auto bg-white/90 backdrop-blur-md">
        <CardHeader
          variant="gradient"
          className="bg-amber-500 mb-4 grid h-28 place-items-center"
        >
          <Typography
            variant="h3"
            color="white"
            className="font-osans uppercase tracking-widest font-light"
          >
            Login
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            color="amber"
            onChange={handleChange}
            name="email"
            label="Email"
            size="lg"
          />
          <Input
            color="amber"
            type="password"
            onChange={handleChange}
            name="password"
            label="Password"
            size="lg"
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            color="amber"
            onClick={handleSignIn}
            variant="gradient"
            fullWidth
            className="flex justify-center items-center"
          >
            {status === 'loading' ? <Spinner /> : <span>Sign In</span>}
          </Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Don&apos;t have an account?
            <NavLink
              to="/register"
              className="ml-1 font-bold hover:text-gray-600 text-amber-700"
            >
              Sign up
            </NavLink>
          </Typography>
        </CardFooter>
      </Card>
    </>
  );
};

export default Login;
