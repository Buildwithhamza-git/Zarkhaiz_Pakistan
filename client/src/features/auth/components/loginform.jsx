import { useForm } from "react-hook-form";

import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import PasswordInput from "../../../shared/components/ui/PasswordInput";
import FormField from "../../../shared/components/ui/FormField";

export default function LoginForm() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <FormField
                label="Email"
                required
                error={errors.email?.message}
            >
                <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                />
            </FormField>

            <FormField
                label="Password"
                required
                error={errors.password?.message}
            >
                <PasswordInput
                    placeholder="Password"
                    {...register("password")}
                />
            </FormField>

            <Button
                type="submit"
                className="w-full"
            >
                Login
            </Button>

        </form>
    );
}