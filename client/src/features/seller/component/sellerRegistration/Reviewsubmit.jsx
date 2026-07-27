import { useFormContext } from "react-hook-form";

export default function ReviewSubmit({
  previousStep,
  goToStep,
  handleSubmit: onSubmitFinal,
  loading,
  error,
}) {
  const { watch } = useFormContext();

  const data = watch();

  const getPreview = (file) => {
    if (!file) return null;
    if (file instanceof File) return URL.createObjectURL(file);
    return file;
  };

  return (
    <div>

      <h2 className="text-3xl font-bold text-green-800">
        Review & Submit
      </h2>

      <p className="mt-2 text-gray-500">
        Double-check your information before submitting
      </p>

      {/* ================= STORE ================= */}
      <Section
        title="Store Information"
        onEdit={() => goToStep(1)}
      >
        <Item label="Store Name" value={data.storeName} />
        <Item label="Province" value={data.province} />
        <Item label="City" value={data.city} />
        <Item label="Address" value={data.address} />
        <Item label="Description" value={data.description} />

        {data.logo && (
          <ImagePreview file={data.logo} />
        )}
      </Section>

      {/* ================= BUSINESS ================= */}
      <Section
        title="Business Information"
        onEdit={() => goToStep(2)}
      >
        <Item label="Business Type" value={data.businessType} />
        <Item label="CNIC" value={data.cnic} />
      </Section>

      {/* ================= BANK ================= */}
      <Section
        title="Payment Information"
        onEdit={() => goToStep(3)}
      >
        <Item label="Bank Name" value={data.bankName} />
        <Item label="Account Title" value={data.accountTitle} />
        <Item label="IBAN" value={data.iban} />
        <Item label="JazzCash" value={data.jazzCash} />
        <Item label="EasyPaisa" value={data.easyPaisa} />
      </Section>

      {/* ================= DOCUMENTS ================= */}
      <Section
        title="Documents"
        onEdit={() => goToStep(4)}
      >
        <div className="flex gap-6 flex-wrap">

          <ImagePreview
            label="CNIC Front"
            file={data?.documents?.cnicFront}
          />

          <ImagePreview
            label="CNIC Back"
            file={data?.documents?.cnicBack}
          />

        </div>
      </Section>

      {/* ================= ERROR ================= */}
      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}

      {/* ================= ACTIONS ================= */}
      <div className="mt-10 flex justify-between">

        <button
          type="button"
          onClick={previousStep}
          className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onSubmitFinal}
          disabled={loading}
          className="px-8 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title, children, onEdit }) {
  return (
    <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>

        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>

    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}

function ImagePreview({ file, label }) {
  if (!file) return null;

  const src =
    file instanceof File
      ? URL.createObjectURL(file)
      : file;

  return (
    <div className="mt-3">

      {label && (
        <p className="text-xs text-gray-500 mb-1">
          {label}
        </p>
      )}

      <img
        src={src}
        alt="preview"
        className="w-40 h-28 object-cover rounded-lg border"
      />

    </div>
  );
}