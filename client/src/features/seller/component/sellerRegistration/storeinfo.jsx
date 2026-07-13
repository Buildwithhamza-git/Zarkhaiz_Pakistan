import Button from "../../../../shared/components/ui//button";

export default function StoreInformation({
    formData,
    setFormData,
    nextStep,
}) {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>

            <h2 className="text-2xl font-bold text-green-800">
                Store Information
            </h2>

            <p className="text-gray-500 mt-2">
                Tell customers about your agricultural store.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

                <div className="md:col-span-2">

                    <label className="font-medium">
                        Store Logo
                    </label>

                    <input
                        type="file"
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

                <div>

                    <label className="font-medium">
                        Store Name
                    </label>

                    <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        placeholder="Green Valley Store"
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

                <div>

                    <label className="font-medium">
                        Province
                    </label>

                    <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-xl p-3"
                    >
                        <option value="">
                            Select Province
                        </option>

                        <option>Punjab</option>
                        <option>Sindh</option>
                        <option>KPK</option>
                        <option>Balochistan</option>
                        <option>Gilgit Baltistan</option>
                        <option>AJK</option>

                    </select>

                </div>

                <div>

                    <label className="font-medium">
                        City
                    </label>

                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

                <div>

                    <label className="font-medium">
                        Store Address
                    </label>

                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="font-medium">
                        Store Description
                    </label>

                    <textarea
                        rows="4"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-2 w-full border rounded-xl p-3"
                    />

                </div>

            </div>

            <div className="flex justify-end mt-10">

                <Button
                    onClick={nextStep}
                    className="px-10"
                >
                    Next →
                </Button>

            </div>

        </div>
    );
}