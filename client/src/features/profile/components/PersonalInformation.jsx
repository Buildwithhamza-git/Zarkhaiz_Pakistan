import { User2 } from "lucide-react";

import Input from "../../../shared/components/ui/input";
import FormField from "../../../shared/components/ui/Formfield";

export default function PersonalInformation({
  register,
  errors,
  email,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}

      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
            <User2
              size={22}
              className="text-green-700"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500">
              Update your account information.
            </p>
          </div>

        </div>
      </div>

      {/* Form */}

      <div className="p-6">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <FormField
            label="First Name"
            required
            error={errors?.firstname?.message}
          >
            <Input
              placeholder="First Name"
              {...register("firstname")}
            />
          </FormField>

          <FormField
            label="Last Name"
            required
            error={errors?.lastname?.message}
          >
            <Input
              placeholder="Last Name"
              {...register("lastname")}
            />
          </FormField>

          <FormField
            label="Username"
            required
            error={errors?.username?.message}
          >
            <Input
              placeholder="Username"
              {...register("username")}
            />
          </FormField>

          <FormField
            label="Phone Number"
            required
            error={errors?.phone?.message}
          >
            <Input
              placeholder="03XXXXXXXXX"
              {...register("phone")}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Email Address"
            >
              <Input
                value={email}
                disabled
                readOnly
              />
            </FormField>
          </div>

        </div>

      </div>

    </div>
  );
}