import { useFormContext } from "react-hook-form";
import Button from "../../../../shared/components/ui/button";

export default function BankInformation({
  nextStep,
  previousStep,
}) {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  const bankName = watch("bankName");
  const iban = watch("iban");
  const jazzCash = watch("jazzCash");
  const easyPaisa = watch("easyPaisa");

  const usingBank = bankName || iban;
  const usingJazz = !!jazzCash;
  const usingEasy = !!easyPaisa;

  const disableBank = usingJazz || usingEasy;
  const disableJazz = usingBank || usingEasy;
  const disableEasy = usingBank || usingJazz;

  const onSubmit = async () => {
    const isValid = await trigger([
      "bankName",
      "accountTitle",
      "iban",
      "jazzCash",
      "easyPaisa",
    ]);

    if (!isValid) {
      const firstError = document.querySelector(".border-red-500");

      firstError?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      firstError?.focus();
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <h2 className="text-2xl font-bold text-green-800">
        Payment Information
      </h2>

      <p className="mt-2 text-gray-500">
        Add at least one payment method to receive payments.
      </p>

      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-700">
          ✔ Use <strong>Bank</strong>, <strong>JazzCash</strong>, or <strong>EasyPaisa</strong>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        {/* ACCOUNT TITLE (ALWAYS REQUIRED) */}
        <div className="md:col-span-2">
          <label className="font-medium">
            Account Title *
          </label>

          <input
            type="text"
            placeholder="Muhammad Ali"
            {...register("accountTitle")}
            className={`mt-2 w-full rounded-xl border p-3 outline-none transition
              ${errors.accountTitle
                ? "border-red-500"
                : "border-gray-300 focus:border-green-600"}
            `}
          />

          {errors.accountTitle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.accountTitle.message}
            </p>
          )}
        </div>

        {/* BANK NAME */}
        <div>
          <label className="font-medium">Bank Name</label>

          <input
            type="text"
            placeholder="Meezan Bank"
            disabled={disableBank}
            {...register("bankName")}
            className={`mt-2 w-full rounded-xl border p-3
              ${errors.bankName
                ? "border-red-500"
                : "border-gray-300 focus:border-green-600"}
              ${disableBank ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
          />

          {errors.bankName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bankName.message}
            </p>
          )}
        </div>

        {/* IBAN */}
        <div>
          <label className="font-medium">IBAN</label>

          <input
            type="text"
            placeholder="PK36SCBL0000001123456702"
            disabled={disableBank}
            {...register("iban")}
            className={`mt-2 w-full rounded-xl border p-3
              ${errors.iban
                ? "border-red-500"
                : "border-gray-300 focus:border-green-600"}
              ${disableBank ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
          />

          {errors.iban && (
            <p className="mt-1 text-sm text-red-600">
              {errors.iban.message}
            </p>
          )}
        </div>

        {/* JAZZCASH */}
        <div>
          <label className="font-medium">JazzCash Number</label>

          <input
            type="text"
            placeholder="03001234567"
            disabled={disableJazz}
            {...register("jazzCash")}
            className={`mt-2 w-full rounded-xl border p-3
              ${errors.jazzCash
                ? "border-red-500"
                : "border-gray-300 focus:border-green-600"}
              ${disableJazz ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
          />

          {errors.jazzCash && (
            <p className="mt-1 text-sm text-red-600">
              {errors.jazzCash.message}
            </p>
          )}
        </div>

        {/* EASYPAISA */}
        <div>
          <label className="font-medium">EasyPaisa Number</label>

          <input
            type="text"
            placeholder="03111234567"
            disabled={disableEasy}
            {...register("easyPaisa")}
            className={`mt-2 w-full rounded-xl border p-3
              ${errors.easyPaisa
                ? "border-red-500"
                : "border-gray-300 focus:border-green-600"}
              ${disableEasy ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
          />

          {errors.easyPaisa && (
            <p className="mt-1 text-sm text-red-600">
              {errors.easyPaisa.message}
            </p>
          )}
        </div>

      </div>

      <div className="flex justify-between mt-10">

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            previousStep();
          }}
        >
          ← Previous
        </Button>

        <Button type="submit">
          Next →
        </Button>

      </div>

    </form>
  );
}