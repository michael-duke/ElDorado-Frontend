import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Chip,
} from '@material-tailwind/react';
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/solid';
import { TagIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const ReservationDetail = ({
  title,
  pickupDate,
  returnDate,
  model,
  status,
}) => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  const formatDate = (date) => moment(date).format('ddd, MMM Do, YYYY');

  return (
    <>
      <Accordion open={open === 1} animate={customAnimation}>
        <AccordionHeader onClick={() => handleOpen(1)}>{title}</AccordionHeader>
        {status === 'retired' && (
          <Chip
            color="red"
            value="car is no longer available"
            icon={<NoSymbolIcon />}
            className="capitalize mt-2"
          />
        )}
        <AccordionBody>
          <ul className="list-outside list-disc">
            <li className="flex gap-1 items-center">
              <TagIcon className="w-7 stroke-amber-600" />
              <span>{model}</span>
            </li>
            <li className="flex gap-1 items-center">
              <BookmarkIcon className="w-7 fill-blue-gray-600" />
              <span>{formatDate(pickupDate)}</span>
            </li>
            <li className="flex gap-1 items-center">
              <BookmarkSlashIcon className="w-7 fill-red-500" />
              <span>{formatDate(returnDate)}</span>
            </li>
          </ul>
        </AccordionBody>
      </Accordion>
    </>
  );
};

ReservationDetail.propTypes = {
  title: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  pickupDate: PropTypes.string.isRequired,
  returnDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
export default ReservationDetail;
