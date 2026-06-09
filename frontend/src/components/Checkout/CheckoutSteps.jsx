import React from 'react';
import { BsTruck, BsCreditCard, BsCheckCircle } from 'react-icons/bs';

const CheckoutSteps = ({ active }) => {
  const steps = [
    {
      number: 1,
      title: 'Shipping',
      icon: BsTruck
    },
    {
      number: 2,
      title: 'Payment',
      icon: BsCreditCard
    },
    {
      number: 3,
      title: 'Success',
      icon: BsCheckCircle
    }
  ];

  return (
    <div className="w-full py-8 bg-gray-900">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Progress Bar */}
          <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2">
            <div className="h-full bg-gray-700 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((active - 1) * 50)}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <div key={step.number} className="relative z-10">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                    ${active >= step.number 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-400'}`}
                >
                  <step.icon size={20} />
                </div>
                
                {/* Step Title */}
                <span 
                  className={`text-sm font-medium transition-colors duration-300
                    ${active >= step.number ? 'text-gray-100' : 'text-gray-500'}`}
                >
                  {step.title}
                </span>
                
                {/* Step Number */}
                <span 
                  className={`text-xs mt-1 transition-colors duration-300
                    ${active >= step.number ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  Step {step.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;