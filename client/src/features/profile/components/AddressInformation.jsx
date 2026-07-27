import { MapPin } from "lucide-react";

import Input from "../../../shared/components/ui/input";
import FormField from "../../../shared/components/ui/Formfield";

export default function AddressInformation({ register, errors }) {
    return (
        <div className="bg-white rounded-2xl border p-6">
            <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
                    <MapPin size={20} />
                </span>
                <div>
                    <h3 className="font-bold text-gray-900">Address Information</h3>
                    <p className="text-sm text-gray-500">Update your address details</p>
                </div>
            </div>

            <FormField label="Address" required error={errors.address?.message}>
                <Input placeholder="House no, street, area" {...register("address")} />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4">
                <FormField label="City" required error={errors.city?.message}>
                    <Input placeholder="City" {...register("city")} />
                </FormField>

                <FormField label="Province" required error={errors.province?.message}>
                    <Input placeholder="Province" {...register("province")} />
                </FormField>

                <FormField label="Postal Code" required error={errors.postalCode?.message}>
                    <Input placeholder="54000" {...register("postalCode")} />
                </FormField>

                <FormField label="Country" required error={errors.country?.message}>
                    <Input placeholder="Country" {...register("country")} />
                </FormField>
            </div>
        </div>
    );
}
