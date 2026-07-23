import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SellerStepper from "./sellerstepper";
import StoreInformation from "./storeinfo";
import BusinessInformation from "./BusinessInformation";
import BankInformation from "./BankInformation";
import DocumentsUpload from "./DocumentsUpload";
import ReviewSubmit from "./Reviewsubmit";

import {
  registerSeller,
  getCurrentSeller,
} from "../../services/sellerApi";

import { useSellerContext } from "../../../../context/sellerContext";

export default function SellerRegistration() {
  const navigate = useNavigate();

  const { refreshSeller } = useSellerContext();

  const [currentStep, setCurrentStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

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
    },
  });

  // ======================================
  // Prevent seller from accessing registration again
  // ======================================

  useEffect(() => {
    const checkSeller = async () => {
      try {
        const response = await getCurrentSeller();

        const seller = response?.data?.seller;

        if (!seller) return;

        switch (seller.status) {
          case "pending":
            navigate("/seller/pending", {
              replace: true,
            });
            break;

          case "approved":
            navigate("/seller/dashboard", {
              replace: true,
            });
            break;

          case "rejected":
            navigate("/become-seller", {
              replace: true,
            });
            break;

          default:
            break;
        }
      } catch (error) {
        if (error.status === 401) {
          navigate("/login", {
            replace: true,
          });
        }
      }
    };

    checkSeller();
  }, [navigate]);

  // ======================================

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // ======================================
  // Submit
  // ======================================

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      setError("");

      const data = new FormData();

      // Store

      data.append("storeName", formData.storeName);
      data.append("description", formData.description);
      data.append("province", formData.province);
      data.append("city", formData.city);
      data.append("address", formData.address);

      // Business

      data.append("businessType", formData.businessType);
      data.append("cnic", formData.cnic);

      // Bank

      data.append("bankName", formData.bankName);
      data.append("accountTitle", formData.accountTitle);
      data.append("iban", formData.iban);
      data.append("jazzCash", formData.jazzCash);
      data.append("easyPaisa", formData.easyPaisa);

      // Logo

      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      // Documents

      if (formData.documents.cnicFront) {
        data.append(
          "cnicFront",
          formData.documents.cnicFront
        );
      }

      if (formData.documents.cnicBack) {
        data.append(
          "cnicBack",
          formData.documents.cnicBack
        );
      }

      // Register Seller

      await registerSeller(data);

      // Refresh Seller Context

      await refreshSeller();

      navigate("/seller/pending", {
        replace: true,
      });
    } catch (error) {
      console.log(error);

      setError(
        error.message ||
          "Failed to submit seller application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-green-800">
            Become a Seller
          </h1>

          <p className="mt-3 text-gray-500">
            Join Pakistan's largest agriculture marketplace.
          </p>
        </div>

        <SellerStepper currentStep={currentStep} />

        <div className="mt-8 rounded-3xl bg-white p-10 shadow-lg">

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

      </div>
    </section>
  );
}