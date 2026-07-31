import { useEffect, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import Cropper from "react-easy-crop";

// --- HELPER TO CONVERT CROP COORDINATES TO FILE OBJECT ---
const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous"; 
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = (error) => reject(error);
  });
};

// --- CROPPER MODAL COMPONENT ---
function CropModal({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => setCrop(crop), []);
  const onZoomChange = useCallback((zoom) => setZoom(zoom), []);
  
  const onCropCompleteInternal = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-lg flex flex-col h-[500px]">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Crop CNIC Image</h3>
          <p className="text-xs text-gray-500">Adjust the frame to fit your ID card clearly</p>
        </div>
        
        {/* Cropper Container */}
        <div className="relative flex-1 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={85.6 / 53.98} // Standard CNIC / ID Card Aspect Ratio
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Zoom Slider & Controls */}
        <div className="p-4 border-t bg-gray-50 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN UPLOAD PAGE COMPONENT ---
export default function DocumentsUpload({ nextStep, previousStep }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const cnicFront = watch("documents.cnicFront");
  const cnicBack = watch("documents.cnicBack");

  const [previews, setPreviews] = useState({ front: null, back: null });

  // Crop Modal state variables
  const [cropTarget, setCropTarget] = useState(null); // 'documents.cnicFront' or 'documents.cnicBack'
  const [sourceImage, setSourceImage] = useState(null); // Local object URL of uncropped file
  const [originalFileName, setOriginalFileName] = useState("");

  useEffect(() => {
    const frontUrl = cnicFront instanceof File ? URL.createObjectURL(cnicFront) : cnicFront;
    const backUrl = cnicBack instanceof File ? URL.createObjectURL(cnicBack) : cnicBack;

    setPreviews({ front: frontUrl, back: backUrl });

    return () => {
      if (cnicFront instanceof File) URL.revokeObjectURL(frontUrl);
      if (cnicBack instanceof File) URL.revokeObjectURL(backUrl);
    };
  }, [cnicFront, cnicBack]);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If it's a PDF, bypass crop layout entirely
    if (file.type === "application/pdf") {
      setValue(fieldName, file, { shouldValidate: true });
      return;
    }

    // Capture file parameters to launch the cropper modal
    setOriginalFileName(file.name);
    setCropTarget(fieldName);
    setSourceImage(URL.createObjectURL(file));
  };

  const handleCropSave = (croppedBlob) => {
    // Reconstruct raw blob back into a File Object for submission
    const croppedFile = new File([croppedBlob], originalFileName, {
      type: "image/jpeg",
    });

    setValue(cropTarget, croppedFile, { shouldValidate: true });
    
    // Reset cropping states
    URL.revokeObjectURL(sourceImage);
    setCropTarget(null);
    setSourceImage(null);
  };

  const handleCropCancel = () => {
    URL.revokeObjectURL(sourceImage);
    setCropTarget(null);
    setSourceImage(null);
  };

  const handleRemove = (fieldName) => {
    setValue(fieldName, null, { shouldValidate: true });
  };

  const handleNext = () => {
    if (!cnicFront || !cnicBack) return;
    nextStep();
  };

  const renderUploader = (label, file, preview, fieldName, error) => {
    const isPdf = file?.type === "application/pdf" || (typeof file === "string" && file.endsWith(".pdf"));

    return (
      <div className="border rounded-xl p-4 bg-gray-50 flex flex-col justify-between">
        <div>
          <label className="block text-sm font-medium mb-3">{label}</label>

          {/* Updated Preview Container: Dynamic height and bounds */}
          <div className="w-full max-h-72 border rounded-lg flex items-center justify-center overflow-hidden bg-white p-1">
            {preview ? (
              isPdf ? (
                <div className="text-center p-4 h-40 flex flex-col justify-center items-center">
                  <span className="text-4xl">📄</span>
                  <p className="text-xs text-gray-500 mt-1">PDF Document</p>
                </div>
              ) : (
                /* Updated Image Tag: Adjusts perfectly to image height */
                <img 
                  src={preview} 
                  alt="preview" 
                  className="w-full h-auto max-h-64 object-contain rounded" 
                />
              )
            ) : (
              <div className="h-40 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No file selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons & Labels */}
        <div>
          <div className="mt-3 flex gap-2">
            <label className="flex-1">
              <input
                type="file"
                hidden
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, fieldName)}
              />
              <div className="cursor-pointer text-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                {file ? "Change" : "Upload"}
              </div>
            </label>

            {file && (
              <button
                type="button"
                onClick={() => handleRemove(fieldName)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          {file && file.name && (
            <p className="mt-2 text-xs text-green-600 truncate">{file.name}</p>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-800">Upload Documents</h2>
      <p className="mt-2 text-gray-500">Upload clear images of your CNIC for verification</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderUploader("CNIC Front", cnicFront, previews.front, "documents.cnicFront", errors?.documents?.cnicFront)}
        {renderUploader("CNIC Back", cnicBack, previews.back, "documents.cnicBack", errors?.documents?.cnicBack)}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={previousStep}
          className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!cnicFront || !cnicBack}
          className={`px-6 py-2 rounded-lg text-white transition-colors ${
            cnicFront && cnicBack ? "bg-green-700 hover:bg-green-800" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>

      {/* Render Modal if a user picks an image file */}
      {sourceImage && (
        <CropModal
          imageSrc={sourceImage}
          onCropComplete={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
