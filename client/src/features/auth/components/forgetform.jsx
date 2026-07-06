import { useForm } from "react-hook-form";

import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import FormField from "../../../shared/components/ui/FormField";

export default function ForgotForm() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <FormField
                label="Email Address"
                required
                error={errors.email?.message}
            >
                <Input
                    type="email"
                    placeholder="Email Address"
                    {...register("email")}
                />
            </FormField>

            <Button
                className="w-full"
                type="submit"
            >
                Send OTP
            </Button>

        </form>
    );
}