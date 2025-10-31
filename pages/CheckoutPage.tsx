import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/Header';
import { CalendarIcon, ClockIcon } from '../components/icons';
import { format } from 'date-fns';

const CheckoutPage: React.FC = () => {
  const { booking, navigateTo, updateUserDetails, applyPromoCode, submitBooking, error } = useAppContext();
  const [promo, setPromo] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!booking.experience) {
    // Should not happen in normal flow
    return <div>Loading experience details...</div>;
  }
  
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!booking.userDetails.fullName.trim()) errors.fullName = 'Full name is required';
    if (!booking.userDetails.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(booking.userDetails.email)) {
        errors.email = 'Email is invalid';
    }
    if (!booking.userDetails.phone.trim()) errors.phone = 'Phone number is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }
  
  const handleConfirm = () => {
    if(validateForm()) {
        submitBooking();
    }
  }

  const handleApplyPromo = () => {
    if (promo.trim()) {
      applyPromoCode(promo);
    }
  };

  return (
    <div>
      <Header title="Checkout" onBack={() => navigateTo({ name: 'details', experienceId: booking.experience!.id })} />
      <main className="p-4 sm:p-6 pb-24">
        {/* Order Summary */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="font-bold text-lg mb-4 text-text-primary">Order Summary</h3>
          <div className="flex space-x-4">
            <img src={booking.experience.images[0]} alt={booking.experience.title} className="w-24 h-24 rounded-lg object-cover" />
            <div>
              <h4 className="font-semibold text-text-primary">{booking.experience.title}</h4>
              <div className="flex items-center text-text-secondary text-sm mt-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{booking.date ? format(new Date(booking.date + 'T00:00:00'), 'MMM d, yyyy') : 'N/A'}</span>
              </div>
              <div className="flex items-center text-text-secondary text-sm mt-1">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>{booking.time || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Form */}
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-4 text-text-primary">Enter your details</h3>
          <div className="space-y-4">
            <div>
              <input type="text" placeholder="Full Name" value={booking.userDetails.fullName} onChange={e => updateUserDetails({ fullName: e.target.value })} className={`w-full p-3 border rounded-lg ${formErrors.fullName ? 'border-danger' : 'border-border-light'}`} />
              {formErrors.fullName && <p className="text-danger text-sm mt-1">{formErrors.fullName}</p>}
            </div>
            <div>
              <input type="email" placeholder="Email Address" value={booking.userDetails.email} onChange={e => updateUserDetails({ email: e.target.value })} className={`w-full p-3 border rounded-lg ${formErrors.email ? 'border-danger' : 'border-border-light'}`} />
              {formErrors.email && <p className="text-danger text-sm mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <input type="tel" placeholder="Phone Number" value={booking.userDetails.phone} onChange={e => updateUserDetails({ phone: e.target.value })} className={`w-full p-3 border rounded-lg ${formErrors.phone ? 'border-danger' : 'border-border-light'}`} />
              {formErrors.phone && <p className="text-danger text-sm mt-1">{formErrors.phone}</p>}
            </div>
          </div>
        </div>
        
        {/* Promo Code */}
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-4 text-text-primary">Promo Code</h3>
          <div className="flex space-x-2">
            <input type="text" placeholder="Enter code" value={promo} onChange={(e) => setPromo(e.target.value)} className="w-full p-3 border border-border-light rounded-lg" />
            <button onClick={handleApplyPromo} className="bg-secondary-bg text-text-primary font-semibold px-6 rounded-lg hover:bg-gray-200 transition-colors">Apply</button>
          </div>
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
        </div>

        {/* Pricing */}
        <div className="mt-6 pt-6 border-t border-border-light space-y-2">
            <div className="flex justify-between text-text-secondary"><p>Base Price</p> <p>${booking.pricing.basePrice.toFixed(2)}</p></div>
            <div className="flex justify-between text-text-secondary"><p>Taxes & Fees</p> <p>${booking.pricing.taxes.toFixed(2)}</p></div>
            {booking.pricing.discount > 0 && (
                <div className="flex justify-between text-success"><p>Discount ({booking.promoCode})</p> <p>-${booking.pricing.discount.toFixed(2)}</p></div>
            )}
            <div className="flex justify-between text-text-primary font-bold pt-2 text-lg border-t border-border-light mt-2"><p>Total</p> <p>${booking.pricing.total.toFixed(2)}</p></div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto bg-white p-4 border-t border-border-light shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-sm">Total</p>
            <p className="text-text-primary font-bold text-xl">${booking.pricing.total.toFixed(2)}</p>
          </div>
          <button
            onClick={handleConfirm}
            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Confirm and pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
