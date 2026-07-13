const steps = [
    "Store",
    "Business",
    "Bank",
    "Documents",
    "Review",
];

export default function SellerStepper({ currentStep }) {
    return (
        <div className="flex items-center justify-between">

            {steps.map((step, index) => {

                const stepNumber = index + 1;

                return (

                    <div
                        key={step}
                        className="flex-1 flex items-center"
                    >

                        <div className="flex flex-col items-center  " >

                            <div
                                className={`
                                w-12
                                h-12
                                rounded-full
                                flex
                                items-center
                                justify-center
                                font-semibold
                                text-white

                                ${
                                    currentStep >= stepNumber
                                        ? "bg-green-700"
                                        : "bg-gray-300"
                                }
                                `}
                            >
                                {stepNumber}
                            </div>

                            <span className="mt-2 text-sm font-medium">
                                {step}
                            </span>

                        </div>

                        {index !== steps.length - 1 && (

                            <div
                                className={`
                                flex-1
                                h-1
                                mx-4

                                ${
                                    currentStep > stepNumber
                                        ? "bg-green-700"
                                        : "bg-gray-300"
                                }
                                `}
                            />

                        )}

                    </div>

                );

            })}

        </div>
    );
}