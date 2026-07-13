import Button from "../../../../shared/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function ReviewSubmit({
    formData,
    previousStep,
    handleSubmit,
}) {
    return (
        <div>

            <div className="text-center">

                <CheckCircle
                    className="mx-auto text-green-700"
                    size={70}
                />

                <h2 className="text-3xl font-bold mt-5 text-green-800">
                    Review Your Information
                </h2>

                <p className="text-gray-500 mt-2">
                    Please review all information before submitting.
                </p>

            </div>

            <div className="mt-12 space-y-8">

                {/* Store */}

                <section className="border rounded-2xl p-6">

                    <h3 className="font-bold text-lg mb-5">
                        Store Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">

                        <Info
                            title="Store Name"
                            value={formData.storeName}
                        />

                        <Info
                            title="Province"
                            value={formData.province}
                        />

                        <Info
                            title="City"
                            value={formData.city}
                        />

                        <Info
                            title="Address"
                            value={formData.address}
                        />

                    </div>

                    <div className="mt-5">

                        <Info
                            title="Description"
                            value={formData.description}
                        />

                    </div>

                </section>

                {/* Business */}

                <section className="border rounded-2xl p-6">

                    <h3 className="font-bold text-lg mb-5">
                        Business Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">

                        <Info
                            title="Business Type"
                            value={formData.businessType}
                        />

                        <Info
                            title="CNIC"
                            value={formData.cnic}
                        />

                    </div>

                </section>

                {/* Bank */}

                <section className="border rounded-2xl p-6">

                    <h3 className="font-bold text-lg mb-5">
                        Payment Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">

                        <Info
                            title="Bank"
                            value={formData.bankName}
                        />

                        <Info
                            title="Account Title"
                            value={formData.accountTitle}
                        />

                        <Info
                            title="IBAN"
                            value={formData.iban}
                        />

                        <Info
                            title="JazzCash"
                            value={formData.jazzCash}
                        />

                        <Info
                            title="EasyPaisa"
                            value={formData.easyPaisa}
                        />

                    </div>

                </section>

                {/* Documents */}

                <section className="border rounded-2xl p-6">

                    <h3 className="font-bold text-lg mb-5">
                        Uploaded Documents
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-5">

                        <Preview
                            title="CNIC Front"
                            file={formData.documents.cnicFront}
                        />

                        <Preview
                            title="CNIC Back"
                            file={formData.documents.cnicBack}
                        />

                    </div>

                </section>

            </div>

            <div className="mt-10 flex items-start gap-3">

                <input
                    type="checkbox"
                    required
                    className="mt-1"
                />

                <p className="text-sm text-gray-600">

                    I confirm that all information is correct and agree to
                    Zarkhaiz Pakistan Seller Terms & Conditions.

                </p>

            </div>

            <div className="flex justify-between mt-10">

                <Button
                    variant="outline"
                    onClick={previousStep}
                >
                    ← Previous
                </Button>

                <Button
                    onClick={handleSubmit}
                >
                    Submit Application
                </Button>

            </div>

        </div>
    );
}

function Info({ title, value }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="font-semibold">{value || "-"}</p>
        </div>
    );
}

function Preview({ title, file }) {

    return (

        <div>

            <p className="text-sm font-medium mb-2">
                {title}
            </p>

            {file ? (

                <img
                    src={URL.createObjectURL(file)}
                    className="h-28 w-full rounded-xl object-cover border"
                    alt=""
                />

            ) : (

                <div className="h-28 rounded-xl border flex items-center justify-center text-sm text-gray-400">
                    Not Uploaded
                </div>

            )}

        </div>

    );

}