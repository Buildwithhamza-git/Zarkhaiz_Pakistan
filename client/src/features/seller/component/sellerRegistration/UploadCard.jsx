import { UploadCloud, X } from "lucide-react";

export default function UploadCard({
    title,
    file,
    onChange,
    onRemove,
}) {

    return (

        <div className="border-2 border-dashed rounded-2xl p-8">

            <h3 className="font-semibold mb-4">
                {title}
            </h3>

            {!file ? (

                <label
                    className="
                    cursor-pointer
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-10
                "
                >

                    <UploadCloud
                        className="text-green-700"
                        size={45}
                    />

                    <p className="mt-4 text-gray-500">
                        Click to Upload
                    </p>

                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={onChange}
                    />

                </label>

            ) : (

                <div className="relative">

                    <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="
                        rounded-xl
                        w-full
                        h-56
                        object-cover
                    "
                    />

                    <button
                        onClick={onRemove}
                        className="
                        absolute
                        top-3
                        right-3
                        bg-red-600
                        text-white
                        rounded-full
                        p-2
                    "
                    >

                        <X size={18} />

                    </button>

                </div>

            )}

        </div>

    );

}