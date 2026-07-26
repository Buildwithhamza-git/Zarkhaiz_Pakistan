import { UploadCloud, FileText, ImageIcon, Trash2, RefreshCw } from "lucide-react";

export default function UploadCard({
    title,
    file,
    accept,
    onChange,
    onRemove,
}) {

    const isImage =
        file &&
        (
            file.type === "image/png" ||
            file.type === "image/jpeg" ||
            file.type === "image/jpg"
        );

    const preview =
        isImage
            ? URL.createObjectURL(file)
            : null;

    return (

        <div className="rounded-2xl border border-gray-200 bg-white p-6">

            <h3 className="font-semibold text-gray-800 mb-4">
                {title}
            </h3>

            {!file ? (

                <label
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-green-600 hover:bg-green-50"
                >

                    <UploadCloud
                        size={42}
                        className="text-green-600"
                    />

                    <p className="mt-3 font-medium">
                        Click to upload
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        PNG, JPG, JPEG or PDF
                    </p>

                    <input
                        type="file"
                        accept={accept}
                        onChange={onChange}
                        hidden
                    />

                </label>

            ) : (

                <div className="rounded-xl border p-4">

                    {isImage ? (

                        <img
                            src={preview}
                            alt="Preview"
                            className="mx-auto h-40 rounded-lg object-cover"
                        />

                    ) : (

                        <div className="flex flex-col items-center">

                            <FileText
                                size={60}
                                className="text-red-600"
                            />

                            <p className="mt-2 text-sm font-medium">
                                PDF Document
                            </p>

                        </div>

                    )}

                    <div className="mt-4 flex items-center justify-center gap-2">

                        <ImageIcon
                            size={18}
                            className="text-gray-500"
                        />

                        <span
                            className="max-w-[220px] truncate text-sm"
                        >
                            {file.name}
                        </span>

                    </div>

                    <div className="mt-5 flex gap-3">

                        <label className="flex-1">

                            <input
                                type="file"
                                accept={accept}
                                hidden
                                onChange={onChange}
                            />

                            <div className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white transition hover:bg-green-700">

                                <RefreshCw size={18} />

                                Change File

                            </div>

                        </label>

                        <button
                            type="button"
                            onClick={onRemove}
                            className="flex items-center justify-center rounded-xl bg-red-600 px-5 text-white transition hover:bg-red-700"
                        >

                            <Trash2 size={18} />

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}