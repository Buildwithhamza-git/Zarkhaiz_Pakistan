import { useEffect, useMemo, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import Modal from "../../../shared/components/ui/Modal";
import Button from "../../../shared/components/ui/button";
import FormField from "../../../shared/components/ui/Formfield";
import RatingInput from "./RatingInput";

const MAX_IMAGES = 5;

export default function ReviewForm({
  open = false,
  onClose,
  productName = "",
  productImage = "",
  mode = "create",
  initialData,
  submitting = false,
  onSubmit,
  inline = false,
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  // images state holds mixed items:
  //   { id, file?: File, url?: string }
  // file = newly selected, url = already uploaded image URL.

  const previews = useMemo(
    () =>
      images.map((image) =>
        image.file ? URL.createObjectURL(image.file) : image.url
      ),
    [images]
  );

  // ==========================================
  // Reset fields each time the modal opens
  // ==========================================

  useEffect(() => {
    if (!open) return;

    setRating(initialData?.rating || 0);
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || initialData?.comment || "");
    setImages(
      Array.isArray(initialData?.images)
        ? initialData.images.map((url) => ({ id: url, url }))
        : []
    );
    setError("");
  }, [open, initialData]);

  // ==========================================
  // Revoke object URLs when previews change or
  // the component unmounts
  // ==========================================

  useEffect(() => {
    const createdUrls = previews.filter((url) => url?.startsWith("blob:"));

    return () => createdUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  // ==========================================
  // Add photos
  // ==========================================

  const handleAddImages = (event) => {
    const selected = Array.from(event.target.files || []);

    event.target.value = "";

    if (images.length + selected.length > MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    setError("");

    setImages((prev) => [
      ...prev,
      ...selected.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
      })),
    ]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
  };

  // ==========================================
  // Submit handler
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError("Please select a star rating.");
      return;
    }

    if (description.trim().length < 3) {
      setError("Please write a review of at least 3 characters.");
      return;
    }

    const payload = {
      rating,
      title: title.trim(),
      description: description.trim(),
    };

    const uploadedImages = [
      ...images.filter((image) => image.url).map((image) => image.url),
      ...images.filter((image) => image.file).map((image) => image.file),
    ];

    const result = await onSubmit(payload, uploadedImages);

    if (result?.success) {
      if (!inline) onClose();
    } else {
      setError(result?.message || "Something went wrong. Please try again.");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {productName && (
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
          {productImage && (
            <img
              src={productImage}
              alt={productName}
              className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover"
            />
          )}

          <p className="text-sm text-gray-600">
            Reviewing:{" "}
            <span className="font-semibold text-gray-900">
              {productName}
            </span>
          </p>
        </div>
      )}

      <FormField label="Rating" required>
        <RatingInput value={rating} onChange={setRating} size={34} />
      </FormField>

      <FormField label="Title (optional)">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Great quality seeds"
          maxLength={100}
          className="
              w-full rounded-xl border border-gray-200 bg-white
              px-4 py-2.5 text-sm text-gray-700 outline-none transition
              focus:border-green-500 focus:ring-2 focus:ring-green-100
            "
        />
      </FormField>

      <FormField label="Review" required>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          maxLength={1000}
          className="
              w-full resize-none rounded-xl border border-gray-200 bg-white
              px-4 py-2.5 text-sm text-gray-700 outline-none transition
              focus:border-green-500 focus:ring-2 focus:ring-green-100
            "
        />
      </FormField>

      {/* ============ PHOTOS ============ */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Add Photos
          </span>

          <span className="text-xs text-gray-400">
            {images.length}/{MAX_IMAGES}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {previews.map((preview, index) => (
            <div
              key={images[index].id}
              className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200"
            >
              <img
                src={preview}
                alt="Review preview"
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(images[index].id)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-green-500 hover:text-green-600">
              <ImagePlus size={20} />
              <span className="mt-1 text-[10px] font-medium">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddImages}
                className="hidden"
              />
            </label>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-400">
          Add up to {MAX_IMAGES} photos of the product you received.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={inline ? () => {} : onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="primary" loading={submitting}>
          {mode === "edit" ? "Update Review" : "Submit Review"}
        </Button>
      </div>
    </form>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit Review" : "Write a Review"}
    >
      {formContent}
    </Modal>
  );
}
