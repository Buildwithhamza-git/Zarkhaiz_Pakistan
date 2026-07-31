import { useFormContext } from "react-hook-form";
import Button from "../../../../shared/components/ui/button";

export default function BusinessInformation({ nextStep, previousStep }) {
    const {
        register,
        handleSubmit,
        trigger,
        setValue, // Added to update formatted value manually if needed, though custom onChange is cleaner
        formState: { errors },
    } = useFormContext();

    const onSubmit = async () => {
        const isValid = await trigger(["businessType", "cnic"]);

        if (!isValid) {
            const firstError = document.querySelector(".border-red-500");
            firstError?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            firstError?.focus();
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        nextStep();
    };

    // Formatter logic for CNIC
    const formatCNIC = (value) => {
        // Strip everything except digits
        const cleanValue = value.replace(/\D/g, "");
        
        // Slice digits up to 13 characters maximum
        const digits = cleanValue.slice(0, 13);
        
        // Inject dashes based on length
        if (digits.length <= 5) return digits;
        if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
        return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    };

    // Get register handlers for cnic
    const { onChange, ...cnicRegister } = register("cnic");

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-bold text-green-800">
                Business Information
            </h2>

            <p className="text-gray-500 mt-2">
                Tell us about your business.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                {/* Business Type */}
                <div>
                    <label className="font-medium">Business Type</label>
                    <select
                        {...register("businessType")}
                        className={`mt-2 w-full rounded-xl border p-3 outline-none transition ${
                            errors.businessType
                                ? "border-red-500"
                                : "border-gray-300 focus:border-green-600"
                        }`}
                    >
                        <option value="">Select Business Type</option>
                        <option value="Farmer">Farmer</option>
                        <option value="Individual">Individual Seller</option>
                        <option value="Company">Company</option>
                    </select>

                    {errors.businessType && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.businessType.message}
                        </p>
                    )}
                </div>

                {/* CNIC */}
                <div>
                    <label className="font-medium">CNIC Number</label>
                    <input
                        type="text"
                        placeholder="35202-1234567-1"
                        {...cnicRegister}
                        onChange={(e) => {
                            // Apply masking pattern
                            e.target.value = formatCNIC(e.target.value);
                            // Call React Hook Form's native onChange to update form state
                            onChange(e);
                        }}
                        className={`mt-2 w-full rounded-xl border p-3 outline-none transition ${
                            errors.cnic
                                ? "border-red-500"
                                : "border-gray-300 focus:border-green-600"
                        }`}
                    />

                    <p className="mt-1 text-xs text-gray-500">
                        Enter 13 digits. Dashes will be added automatically.
                    </p>

                    {errors.cnic && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.cnic.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-10">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                        previousStep();
                    }}
                >
                    ← Previous
                </Button>

                <Button type="submit">Next →</Button>
            </div>
        </form>
    );
}
