import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="card">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-4">
            Reservation Confirmed!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your reservation. We have sent a confirmation email with all the details.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/" className="btn-primary block">
            Return to Home
          </Link>
          
          <p className="text-sm text-gray-500">
            If you have any questions, please don't hesitate to contact us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
