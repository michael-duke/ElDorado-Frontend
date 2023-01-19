import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  Typography,
  Input,
  Button,
  Textarea,
} from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ErrorMessage, Formik, Form, Field,
} from 'formik';
import * as Yup from 'yup';
import { addCar, allMessages, allStatus } from '../redux/Home/home';
import useToken from '../redux/Auth/useToken';
import { authenticatedUser } from '../redux/Auth/authSlice';
import Alert from './Alert';
import { Spinner } from './Loader';

const AddCar = () => {
  const defaultImg = 'https://www.fluttercampus.com/img/4by3.webp';

  const message = useSelector(allMessages);
  const status = useSelector(allStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isTokenSet = useToken();
  const currentUser = useSelector(authenticatedUser);

  const initialValues = {
    name: '',
    description: '',
    daily_price: '',
    model: '',
    image: defaultImg,
    available: true,
  };

  const CarSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, 'Too Short!')
      .max(250, 'Too Long!')
      .matches(
        /^(?=.{4,50}$)(?![a-z])(?!.*[_.]{2})[a-zA-Z0-9 ]+(?<![_.])$/,
        'Name should have at least 4 characters and should not contain special characters or punctuations!',
      )
      .required('Name is required!'),
    description: Yup.string()
      .required('Description is required!')
      .min(5, 'Too Short!')
      .max(500, 'Too Long!'),
    daily_price: Yup.number()
      .required('Price is required!')
      .positive('Please enter only positive numbers!')
      .integer('Please enter only integers!'),
    model: Yup.string()
      .required('Model is required!')
      .min(4, 'Too Short!')
      .max(250, 'Too Long!'),
    image: Yup.string()
      .url('Invalid Url')
      .required('Image is required!')
      .matches(
        /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i,
        'Should end with gif | jpeg | tiff | png | webp | bmp | jpg',
      ),
  });

  document.title = 'ElDorado | AddCar';

  const handleAddCar = (car) => {
    dispatch(addCar({ ownerId: currentUser.id, car }));
  };

  const checkAuthUser = () => {
    if (!isTokenSet) navigate('/login');
  };

  const navigateDeleteCar = () => {
    if (message === 'Car has been successfully created') navigate('/delete_car');
  };

  useEffect(() => {
    navigateDeleteCar();
    checkAuthUser();
  }, [message, isTokenSet]);

  return (
    <>
      {status === 'failed' && <Alert message={message} />}
      <Card className="mt-5 mb-64 max-w-[450px] mx-auto bg-white/90 backdrop-blur-md">
        <CardHeader
          variant="gradient"
          className="mb-4 grid h-28 place-items-center text-white bg-black/50 backdrop-blur-md"
        >
          <Typography
            variant="h3"
            color="white"
            className="font-osans uppercase tracking-widest font-light"
          >
            Add a Car
          </Typography>
        </CardHeader>
        <CardBody className="text-center">
          <Typography variant="h5" className="mb-2">
            Kind Note
          </Typography>
          <Typography className="text-left">
            Kindly fill in the form below to add a car to the list of available
            cars.
          </Typography>
        </CardBody>
        <Formik
          initialValues={initialValues}
          onSubmit={handleAddCar}
          validationSchema={CarSchema}
        >
          {({
            errors, touched, isValid, dirty, values,
          }) => (
            <Form>
              <CardBody className="flex flex-col gap-4">
                <div>
                  <img src={values.image} alt="car-preview" />
                </div>
                <Field
                  as={Input}
                  name="name"
                  color="amber"
                  size="md"
                  label="Name"
                  error={Boolean(errors.name) && touched.name}
                />
                <ErrorMessage
                  name="name"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
                <Field
                  as={Input}
                  name="image"
                  color="amber"
                  size="md"
                  label="Put a Car Image link"
                  error={Boolean(errors.image) && touched.image}
                />
                <ErrorMessage
                  name="image"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
                <Field
                  as={Input}
                  name="model"
                  color="amber"
                  size="md"
                  Checkbox
                  label="Model"
                  error={Boolean(errors.model) && touched.model}
                />
                <ErrorMessage
                  name="model"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
                <Field
                  as={Input}
                  name="daily_price"
                  type="number"
                  color="amber"
                  size="lg"
                  label="Daily Price"
                  error={Boolean(errors.daily_price) && touched.daily_price}
                />
                <ErrorMessage
                  name="daily_price"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
                <Field
                  as={Textarea}
                  name="description"
                  color="amber"
                  label="Description"
                  size="md"
                  error={Boolean(errors.description) && touched.description}
                />
                <ErrorMessage
                  name="description"
                  render={(msg) => (
                    <span className="text-xs text-gray-500">{msg}</span>
                  )}
                />
                <Field
                  as={Checkbox}
                  name="available"
                  color="amber"
                  defaultChecked
                  label={values.available ? 'Available' : "Don't put in list"}
                />
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  type="submit"
                  color="amber"
                  variant="gradient"
                  fullWidth
                  className="capitalize flex justify-center items-center"
                  disabled={!isValid || !dirty}
                >
                  {status === 'loading' ? <Spinner /> : <span>Add Car</span>}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default AddCar;
