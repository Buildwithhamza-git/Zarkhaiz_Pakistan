import { Check } from "lucide-react";

const steps = [
    "Store",
    "Business",
    "Bank",
    "Documents",
    "Review",
];

export default function SellerStepper({
    currentStep,
    goToStep,
}) {
    return (
        <div className="flex items-center justify-between">

            {steps.map((step, index) => {

                const stepNumber = index + 1;

                const completed =
                    currentStep > stepNumber;

                const active =
                    currentStep === stepNumber;

                // All steps are clickable so the user can jump
                // to any section at any time.
                const clickable = true;

                return (

                    <div
                        key={step}
                        className="flex flex-1 items-center"
                    >

                        <button
                            type="button"
                            onClick={() => goToStep(stepNumber)}
                            className="flex flex-col items-center group cursor-pointer"
                        >

                            <div
                                className={`
                                    w-12
                                    h-12
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    font-semibold
                                    transition-all
                                    duration-300

                                    ${
                                        completed
                                            ? "bg-green-700 text-white"
                                            : ""
                                    }

                                    ${
                                        active
                                            ? "bg-white text-green-700 border-4 border-green-700 shadow-lg scale-110"
                                            : ""
                                    }

                                    ${
                                        !completed &&
                                        !active
                                            ? "bg-gray-200 text-gray-500"
                                            : ""
                                    }

                                    group-hover:scale-105
                                `}
                            >

                                {completed ? (
                                    <Check
                                        size={22}
                                        strokeWidth={3}
                                    />
                                ) : (
                                    stepNumber
                                )}

                            </div>

                            <span
                                className={`
                                    mt-3
                                    text-sm
                                    font-semibold
                                    transition

                                    ${
                                        active
                                            ? "text-green-700"
                                            : "text-gray-600"
                                    }

                                    group-hover:text-green-700
                                `}
                            >
                                {step}
                            </span>

                        </button>

                        {index !== steps.length - 1 && (

                            <div
                                className={`
                                    flex-1
                                    h-1
                                    mx-4
                                    rounded-full
                                    transition-all

                                    ${
                                        completed
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