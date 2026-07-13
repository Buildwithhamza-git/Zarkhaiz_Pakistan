import Button from "../../../../shared/components/ui/button";

export default function BankInformation({
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
                Bank Information
            </h2>

            <p className="text-gray-500 mt-2">
                Enter your payment details to receive orders.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

                <div>

                    <label className="font-medium">
                        Bank Name
                    </label>

                    <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="HBL"
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

                <div>

                    <label className="font-medium">
                        Account Title
                    </label>

                    <input
                        type="text"
                        name="accountTitle"
                        value={formData.accountTitle}
                        onChange={handleChange}
                        placeholder="Muhammad Ali"
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="font-medium">
                        IBAN
                    </label>

                    <input
                        type="text"
                        name="iban"
                        value={formData.iban}
                        onChange={handleChange}
                        placeholder="PK36SCBL0000001123456702"
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

                <div>

                    <label className="font-medium">
                        JazzCash Number
                    </label>

                    <input
                        type="text"
                        name="jazzCash"
                        value={formData.jazzCash}
                        onChange={handleChange}
                        placeholder="03001234567"
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

                <div>

                    <label className="font-medium">
                        EasyPaisa Number
                    </label>

                    <input
                        type="text"
                        name="easyPaisa"
                        value={formData.easyPaisa}
                        onChange={handleChange}
                        placeholder="03111234567"
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