import { Camera } from "lucide-react";

export default function ReviewPhotos({ photos = [] }) {
  if (!Array.isArray(photos) || photos.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Camera size={18} className="text-gray-500" />
        <h3 className="font-semibold text-gray-900">Customer Photos</h3>
        <span className="text-xs text-gray-400">({photos.length})</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <a
            key={index}
            href={photo.image}
            target="_blank"
            rel="noreferrer"
            title={photo.name}
            className="group relative block h-20 w-20 overflow-hidden rounded-xl border border-gray-200"
          >
            <img
              src={photo.image}
              alt={photo.name || "Customer photo"}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
