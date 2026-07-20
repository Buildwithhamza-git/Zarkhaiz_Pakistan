import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerStepper from "./sellerstepper";
import StoreInformation from "./storeinfo";
import BusinessInformation from "./BusinessInformation";
import BankInformation from "./BankInformation";
import DocumentsUpload from "./DocumentsUpload";
import ReviewSubmit from "./Reviewsubmit";
import { registerSeller } from "../../services/sellerApi";


export default function SellerRegistration() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({

        logo: null,
        storeName: "",
        description: "",
        province: "",
        city: "",
        address: "",

        businessType: "",
        cnic: "",

        bankName: "",
        accountTitle: "",
        iban: "",
        jazzCash: "",
        easyPaisa: "",

        documents: {
            cnicFront: null,
            cnicBack: null,
        }


    });

    const nextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const previousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
        setError("");
            const data = new FormData();

            // Store Information
            data.append("storeName", formData.storeName);
            data.append("description", formData.description);
            data.append("province", formData.province);
            data.append("city", formData.city);
            data.append("address", formData.address);

            // Business Information
            data.append("businessType", formData.businessType);
            data.append("cnic", formData.cnic);

            // Bank Information
            data.append("bankName", formData.bankName);
            data.append("accountTitle", formData.accountTitle);
            data.append("iban", formData.iban);
            data.append("jazzCash", formData.jazzCash);
            data.append("easyPaisa", formData.easyPaisa);

            // Documents
            if (formData.logo) {
                data.append("logo", formData.logo);
            }

            if (formData.documents.cnicFront) {
                data.append("cnicFront", formData.documents.cnicFront);
            }

            if (formData.documents.cnicBack) {
                data.append("cnicBack", formData.documents.cnicBack);
            }

            const response = await registerSeller(data);

            console.log(response);

            navigate("/seller/pending");

        } catch (error) {
              setError(error.message || "Something went wrong");
            console.error(error);
        }
        finally {
        setLoading(false);
    }
    };
    return (
        <section className="py-16 px-6 " >
            <div className="max-w-5xl mx-auto   ">

                <div className="text-center mb-10">

                    <h1 className="text-4xl font-bold text-green-800">
                        Become a Seller
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Join Pakistan's largest agriculture marketplace.
                    </p>

                </div>
                <div className="w-full mx-2">
                    <SellerStepper currentStep={currentStep} />

                    <div className="mt-8 bg-white rounded-3xl shadow-lg p-10">

                        {currentStep === 1 && (
                            <StoreInformation
                                formData={formData}
                                setFormData={setFormData}
                                nextStep={nextStep}
                            />
                        )}

                        {currentStep === 2 && (
                            <BusinessInformation
                                formData={formData}
                                setFormData={setFormData}
                                nextStep={nextStep}
                                previousStep={previousStep}
                            />
                        )}

                        {currentStep === 3 && (
                            <BankInformation
                                formData={formData}
                                setFormData={setFormData}
                                nextStep={nextStep}
                                previousStep={previousStep}
                            />
                        )}

                        {currentStep === 4 && (

                            <DocumentsUpload
                                formData={formData}
                                setFormData={setFormData}
                                nextStep={nextStep}
                                previousStep={previousStep}
                            />

                        )}

                        {currentStep === 5 && (
                            <ReviewSubmit
                                formData={formData}
                                previousStep={previousStep}
                                handleSubmit={handleSubmit}
                                loading={loading}
                                error={error}
                            />
                        )}
                    </div>

                </div></div>
        </section>
    );
}