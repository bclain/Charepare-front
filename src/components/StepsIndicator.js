import React from 'react';

const StepsIndicator = ({ steps, currentStep, goToStep }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`step-item ${index === currentStep ? 'active' : ''}`}
        >
          {index === currentStep ?
            <svg  viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.1" y="0.731226" width="8.8" height="8.8" rx="4.4" fill="url(#paint0_linear_199_128)" stroke="#25AAA5" stroke-width="0.2" />
              <defs>
                <linearGradient id="paint0_linear_199_128" x1="4.5" y1="0.631226" x2="4.5" y2="9.63123" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#C5FFFE" />
                  <stop offset="1" stop-color="#25AAA5" />
                </linearGradient>
              </defs>
            </svg>
            :
            <svg viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0.631226" width="9" height="9" rx="4.5" fill="#D9D9D9" />
            </svg>
          }
          <p>{step}</p>
        </div>
      ))}
    </div>
  );
};

export default StepsIndicator;