import React from 'react'

const steps = [
  { label: 'Cart', key: 'cart' },
  { label: 'Shipping', key: 'shipping' },
  { label: 'Placed', key: 'order' }
]

const Progress = ({ activeStep = 'cart' }) => {
  const activeIdx = steps.findIndex(s => s.key === activeStep);
  const allGreen = activeStep === 'order';

  return (
   <div className="w-full flex items-center justify-center py-8" style={{ marginTop: '80px' }}>

      <div className="flex items-center w-full max-w-xl">
        {steps.map((step, idx) => {
          const isActive = idx === activeIdx;
          const isCompleted = idx < activeIdx;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1 min-w-[70px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base
                    ${allGreen
                      ? 'bg-green-500 text-white shadow-lg'
                      : isActive
                        ? 'bg-black text-white shadow-lg'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'}
                  `}
                >
                  {idx + 1}
                </div>
                <span className={`mt-2 text-xs sm:text-sm font-medium ${allGreen ? 'text-green-700' : isActive ? 'text-black' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex items-center flex-1 h-8">
                  <div className="w-full h-1 bg-gray-200 relative mb-6">
                    <div
                      className={`absolute top-0 left-0 h-1 transition-all duration-300
                        ${allGreen || activeIdx > idx ? 'bg-green-500 w-full' : 'bg-gray-200 w-full'}
                      `}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Progress