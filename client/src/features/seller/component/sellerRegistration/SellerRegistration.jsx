// import { useState, useEffect, useMemo } from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForm,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SellerStepper from "./sellerstepper";
import StoreInformation from "./storeinfo";
import BusinessInformation from "./BusinessInformation";
import BankInformation from "./BankInformation";
import DocumentsUpload from "./DocumentsUpload";
import ReviewSubmit from "./Reviewsubmit";

// import { sellerSchema } from "../../validations/sellervalidation.schema";
import {
  storeSchema,
  businessSchema,
  bankSchema,
  documentSchema,
} from "../../validations/sellervalidation.schema";

import {
  registerSeller,
  getCurrentSeller,
} from "../../services/sellerApi";

import { useSellerContext } from "../../../../context/sellerContext";

const STORAGE_KEY = "seller-registration";

const defaultValues = {
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
};

export default function SellerRegistration() {

  const navigate = useNavigate();

  const { refreshSeller } = useSellerContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const savedData = (() => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultValues;
  })();


  const currentSchema = useMemo(() => {

  if (currentStep === 1) return storeSchema;
  if (currentStep === 2) return businessSchema;
  if (currentStep === 3) return bankSchema;
  if (currentStep === 4) return documentSchema;

  return storeSchema;

}, [currentStep]);

const methods = useForm({
  resolver: zodResolver(currentSchema),
  mode: "onChange",
  defaultValues: savedData,
});

  const { watch, getValues } = methods;

  // ==========================
  // Persist form
  // ==========================

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(value)
      );
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // ==========================
  // Check Seller Status
  // ==========================

  useEffect(() => {
    const checkSeller = async () => {
      try {
        const response = await getCurrentSeller();

        const seller = response?.data?.seller;

        if (!seller) return;

        switch (seller.status) {

          case "pending":
            navigate("/seller/pending", { replace: true });
            break;

          case "approved":
            navigate("/seller/dashboard", { replace: true });
            break;

          case "rejected":
            navigate("/become-seller", { replace: true });
            break;

          default:
            break;
        }

      } catch (err) {

        if (err.status === 401) {

          navigate("/login", {
            replace: true,
          });

        }

      }
    };

    checkSeller();

  }, [navigate]);

  // ==========================
  // Navigation
  // ==========================

  const scrollTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  const nextStep = () => {
    scrollTop();
    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    scrollTop();
    setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (step) => {
    scrollTop();
    setCurrentStep(step);
  };

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async () => {

    if (loading) return;

    try {

      setLoading(true);
      setError("");

      const values = getValues();

      const data = new FormData();

      Object.entries(values).forEach(([key, value]) => {

        if (key === "documents") return;

        if (value instanceof File) {

          data.append(key, value);

        } else {

          data.append(key, value ?? "");

        }

      });

      if (values.documents?.cnicFront) {

        data.append(
          "cnicFront",
          values.documents.cnicFront
        );

      }

      if (values.documents?.cnicBack) {

        data.append(
          "cnicBack",
          values.documents.cnicBack
        );

      }

      await registerSeller(data);

      await refreshSeller();

      localStorage.removeItem(STORAGE_KEY);

      navigate("/seller/pending", {
        replace: true,
      });

    } catch (err) {

      console.log(err);

      setError(
        err.message ||
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

        <SellerStepper
          currentStep={currentStep}
          goToStep={goToStep}
        />

        <div className="mt-8 rounded-3xl bg-white p-10 shadow-lg">

          <FormProvider {...methods}>

            {currentStep === 1 && (
              <StoreInformation
                nextStep={nextStep}
              />
            )}

            {currentStep === 2 && (
              <BusinessInformation
                nextStep={nextStep}
                previousStep={previousStep}
              />
            )}

            {currentStep === 3 && (
              <BankInformation
                nextStep={nextStep}
                previousStep={previousStep}
              />
            )}

            {currentStep === 4 && (
              <DocumentsUpload
                nextStep={nextStep}
                previousStep={previousStep}
              />
            )}

            {currentStep === 5 && (
              <ReviewSubmit
                previousStep={previousStep}
                handleSubmit={handleSubmit}
                loading={loading}
                error={error}
                goToStep={goToStep}
              />
            )}

          </FormProvider>

        </div>

      </div>

    </section>
  );
}