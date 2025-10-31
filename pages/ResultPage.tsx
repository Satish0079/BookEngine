import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircleIcon, XCircleIcon } from '../components/icons';

interface ResultPageProps {
  status: 'success' | 'failure';
}

const ResultPage: React.FC<ResultPageProps> = ({ status }) => {
  const { booking, resetBooking } = useAppContext();

  const isSuccess = status === 'success';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {isSuccess ? (
        <>
          <CheckCircleIcon className="w-24 h-24 text-success" />
          <h1 className="text-3xl font-bold mt-6 text-text-primary">Booking Confirmed!</h1>
          <p className="text-text-secondary mt-2 max-w-sm">
            Your booking for <strong>{booking.experience?.title}</strong> has been confirmed. A confirmation email has been sent to you.
          </p>
          <div className="mt-8 p-4 border border-border-light rounded-lg text-left w-full max-w-sm">
            <h3 className="font-bold mb-2">Booking Summary</h3>
            <p className="text-sm text-text-secondary"><strong>Date:</strong> {booking.date}</p>
            <p className="text-sm text-text-secondary"><strong>Time:</strong> {booking.time}</p>
            <p className="text-sm text-text-secondary"><strong>Name:</strong> {booking.userDetails.fullName}</p>
            <p className="font-semibold mt-2 pt-2 border-t"><strong>Total Paid:</strong> ${booking.pricing.total.toFixed(2)}</p>
          </div>
        </>
      ) : (
        <>
          <XCircleIcon className="w-24 h-24 text-danger" />
          <h1 className="text-3xl font-bold mt-6 text-text-primary">Booking Failed</h1>
          <p className="text-text-secondary mt-2 max-w-sm">
            We're sorry, but we were unable to process your booking at this time. Please try again later.
          </p>
        </>
      )}

      <button
        onClick={resetBooking}
        className="mt-10 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ResultPage;
