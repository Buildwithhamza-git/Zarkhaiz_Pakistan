import { useForm } from "react-hook-form";

import PasswordInput from "../../../shared/components/ui/PasswordInput";
import Button from "../../../shared/components/ui/Button";
import FormField from "../../../shared/components/ui/FormField";

export default function ResetForm() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >

            <FormField
                label="New Password"
                required
                error={errors.password?.message}
            >
                <PasswordInput
                    placeholder="New Password"
                    {...register("password")}
                />
            </FormField>

            <FormField
                label="Confirm Password"
                required
                error={errors.confirmPassword?.message}
            >
                <PasswordInput
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                />
            </FormField>

            <Button
                className="w-full"
                type="submit"
            >
                Reset Password
            </Button>

        </form>
    );
}