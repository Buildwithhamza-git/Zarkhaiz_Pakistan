import { useFormContext } from "react-hook-form";

import Button from "../../../../shared/components/ui/button";
import ImageUpload from "../../../../shared/components/ui/imageUploader";

export default function StoreInformation({ nextStep }) {

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    // ✅ FIXED: NO trigger(), let RHF + Zod handle validation
    const onSubmit = (data) => {

        console.log("STEP 1 VALID ✅", data);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        nextStep();
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <h2 className="text-2xl font-bold text-green-800">
                Store Information
            </h2>

            <p className="mt-2 text-gray-500">
                Tell customers about your agricultural store.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

                {/* Logo */}
                <div className="md:col-span-2">

                    <label className="font-medium">
                        Store Logo
                    </label>

                    <div className="mt-3">

                        <ImageUpload
                            value={watch("logo")}
                            onChange={(file) =>
                                setValue("logo", file, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                })
                            }
                        />

                    </div>

                    {errors.logo && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.logo.message}
                        </p>
                    )}

                </div>

                {/* Store Name */}
                <div>

                    <label className="font-medium">
                        Store Name
                    </label>

                    <input
                        type="text"
                        placeholder="Green Valley Store"
                        {...register("storeName")}
                        className={`mt-2 w-full rounded-xl border p-3 outline-none transition
                        ${
                            errors.storeName
                                ? "border-red-500"
                                : "border-gray-300 focus:border-green-600"
                        }`}
                    />

                    {errors.storeName && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.storeName.message}
                        </p>
                    )}

                </div>

                {/* Province */}
                <div>

                    <label className="font-medium">
                        Province
                    </label>

                    <select
                        {...register("province")}
                        className={`mt-2 w-full rounded-xl border p-3 outline-none
                        ${
                            errors.province
                                ? "border-red-500"
                                : "border-gray-300 focus:border-green-600"
                        }`}
                    >
                        <option value="">
                            Select Province
                        </option>

                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                        <option value="AJK">AJK</option>

                    </select>

                    {errors.province && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.province.message}
                        </p>
                    )}

                </div>

                {/* City */}
                <div>

                    <label className="font-medium">
                        City
                    </label>

                    <input
                        type="text"
                        {...register("city")}
                        className={`mt-2 w-full rounded-xl border p-3 outline-none
                        ${
                            errors.city
                                ? "border-red-500"
                                : "border-gray-300 focus:border-green-600"
                        }`}
                    />

                    {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.city.message}
                        </p>
                    )}

                </div>

                {/* Address */}
                <div>

                    <label className="font-medium">
                        Store Address
                    </label>

                    <input
                        type="text"
                        {...register("address")}
                        className={`mt-2 w-full rounded-xl border p-3 outline-none
                        ${
                            errors.address
                                ? "border-red-500"
                                : "border-gray-300 focus:border-green-600"
                        }`}
                    />

                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.address.message}
                        </p>
                    )}

                </div>

                {/* Description */}
                <div className="md:col-span-2">

                    <label className="font-medium">
                        Store Description
                    </label>

                    <textarea
                        rows="5"
                        {...register("description")}
                        placeholder="Write a short description about your store..."
                        className={`mt-2 w-full rounded-xl border p-3 outline-none resize-none
                        ${
                            errors.description
                                ? "border-red-500"
                                : "border-gray-300 focus:border-green-600"
                        }`}
                    />

                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.description.message}
                        </p>
                    )}

                </div>

            </div>

            <div className="flex justify-end mt-10">

                {/* ✅ IMPORTANT: MUST be type="submit" */}
                <Button
                    type="submit"
                    className="px-10"
                >
                    Next →
                </Button>

            </div>

        </form>
    );
}