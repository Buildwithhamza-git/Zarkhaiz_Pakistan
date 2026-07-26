import { useFormContext } from "react-hook-form";

export default function DocumentsUpload({
  nextStep,
  previousStep,
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const cnicFront = watch("documents.cnicFront");
  const cnicBack = watch("documents.cnicBack");

  // Handle file change
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue(fieldName, file, {
      shouldValidate: true,
    });
  };

  // Remove file
  const handleRemove = (fieldName) => {
    setValue(fieldName, null, {
      shouldValidate: true,
    });
  };

  // Preview helper
  const getPreview = (file) => {
    if (!file) return null;
    if (typeof file === "string") return file;
    if (file instanceof File) return URL.createObjectURL(file);
    return null;
  };

  const handleNext = () => {
    if (!cnicFront || !cnicBack) return;
    nextStep();
  };

  const renderUploader = (label, file, fieldName, error) => {
    const preview = getPreview(file);

    return (
      <div className="border rounded-xl p-4 bg-gray-50">

        <label className="block text-sm font-medium mb-3">
          {label}
        </label>

        {/* Preview */}
        <div className="w-full h-40 border rounded-lg flex items-center justify-center overflow-hidden bg-white">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-sm">
              No file selected
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-3 flex gap-2">

          <label className="flex-1">
            <input
              type="file"
              hidden
              accept="image/*,application/pdf"
              onChange={(e) =>
                handleFileChange(e, fieldName)
              }
            />

            <div className="cursor-pointer text-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
              {file ? "Change" : "Upload"}
            </div>
          </label>

          {file && (
            <button
              type="button"
              onClick={() => handleRemove(fieldName)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          )}
        </div>

        {/* File name */}
        {file && file.name && (
          <p className="mt-2 text-xs text-green-600 truncate">
            {file.name}
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error.message}
          </p>
        )}

      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-800">
        Upload Documents
      </h2>

      <p className="mt-2 text-gray-500">
        Upload clear images of your CNIC for verification
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {renderUploader(
          "CNIC Front",
          cnicFront,
          "documents.cnicFront",
          errors?.documents?.cnicFront
        )}

        {renderUploader(
          "CNIC Back",
          cnicBack,
          "documents.cnicBack",
          errors?.documents?.cnicBack
        )}

      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-between">

        <button
          type="button"
          onClick={previousStep}
          className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!cnicFront || !cnicBack}
          className={`px-6 py-2 rounded-lg text-white ${
            cnicFront && cnicBack
              ? "bg-green-700 hover:bg-green-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>

      </div>
    </div>
  );
}