'use client';

export default function Stepper({ currentStep }) {
    const steps = [
        { number: 1, title: 'Cadastro' },
        { number: 2, title: 'Análise' },
        { number: 3, title: 'Playlists' }
    ];

    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className={`
              w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
              ${currentStep >= step.number
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-400'}
              transition-all duration-300
            `}>
                            {currentStep > step.number ? '✓' : step.number}
                        </div>
                        <span className={`
              mt-2 text-sm font-medium
              ${currentStep >= step.number ? 'text-purple-400' : 'text-gray-500'}
            `}>
                            {step.title}
                        </span>
                    </div>

                    {index < steps.length - 1 && (
                        <div className={`
              w-24 h-1 mx-4 mb-6
              ${currentStep > step.number ? 'bg-purple-600' : 'bg-gray-700'}
              transition-all duration-300
            `} />
                    )}
                </div>
            ))}
        </div>
    );
}
