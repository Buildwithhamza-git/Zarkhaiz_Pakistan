import { User as UserIcon } from "lucide-react";

import Input from "../../../shared/components/ui/input";
import FormField from "../../../shared/components/ui/Formfield";

export default function PersonalInformation({ register, errors, email }) {
    return (
        <div className="bg-white rounded-2xl border p-6">
            <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
                    <UserIcon size={20} />
                </span>
                <div>
                    <h3 className="font-bold text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-500">Update your personal details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
                <FormField label="First Name" required error={errors.firstname?.message}>
                    <Input placeholder="First name" {...register("firstname")} />
                </FormField>

                <FormField label="Last Name" required error={errors.lastname?.message}>
                    <Input placeholder="Last name" {...register("lastname")} />
                </FormField>

                <FormField label="Username" required error={errors.username?.message}>
                    <Input placeholder="Username" {...register("username")} />
                </FormField>

                <FormField label="Email Address">
                    <Input value={email || ""} disabled readOnly />
                </FormField>

                <FormField label="Phone Number" required error={errors.phone?.message}>
                    <Input placeholder="03XXXXXXXXX" {...register("phone")} />
                </FormField>

                <FormField label="Date of Birth (Optional)" error={errors.dateOfBirth?.message}>
                    <Input type="date" {...register("dateOfBirth")} />
                </FormField>
            </div>
        </div>
    );
}
