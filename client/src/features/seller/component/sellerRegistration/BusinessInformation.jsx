import Button from "../../../../shared/components/ui/button";

export default function BusinessInformation({
    formData,
    setFormData,
    nextStep,
    previousStep,
}) {

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>

            <h2 className="text-2xl font-bold text-green-800">
                Business Information
            </h2>

            <p className="text-gray-500 mt-2">
                Tell us about your business.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

                <div>

                    <label className="font-medium">
                        Business Type
                    </label>

                    <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-xl p-3"
                    >
                        <option value="">
                            Select Business Type
                        </option>

                        <option value="Farmer">
                            Farmer
                        </option>

                        <option value="Individual Seller">
                            Individual Seller
                        </option>

                        <option value="Company">
                            Company
                        </option>

                    </select>

                </div>

                <div>

                    <label className="font-medium">
                        CNIC Number
                    </label>

                    <input
                        type="text"
                        name="cnic"
                        placeholder="35202-1234567-1"
                        value={formData.cnic}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>


            </div>

            <div className="flex justify-between mt-10">

                <Button
                    variant="outline"
                    onClick={previousStep}
                >
                    ← Previous
                </Button>

                <Button onClick={nextStep}>
                    Next →
                </Button>

            </div>

        </div>
    );
}