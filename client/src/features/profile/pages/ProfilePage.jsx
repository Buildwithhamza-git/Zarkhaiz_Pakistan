import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";

import ProfileSidebar from "../components/ProfileSidebar";
import PersonalInformation from "../components/PersonalInformation";
import AccountSettings from "../components/AccountSettings";
import SaveChangesBar from "../components/SaveChangesBar";

import Loader from "../../../shared/components/ui/Loader";
import Toast from "../../../shared/components/ui/Toast"; // ✅ your toast

import useAuthContext from "../../../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import { profileSchema } from "../validations/profileValidation";

export default function ProfilePage() {

    const { user, setUser } = useAuthContext();

    const {
        fetchProfile,
        saveProfile,
        fetchLoading,
        saveLoading,
        toast,
        hideToast,
    } = useProfile();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        setFocus,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            username: "",
            phone: "",
        },
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetchProfile();

                const profile = response.user;

                setUser(profile);

                reset({
                    firstname: profile.firstname,
                    lastname: profile.lastname,
                    username: profile.username,
                    phone: profile.phone,
                });

            } catch (error) {
                console.error(error);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
    const firstErrorField = Object.keys(errors)[0];

    if (firstErrorField) {
        setFocus(firstErrorField);

        const element = document.querySelector(
            `[name="${firstErrorField}"]`
        );

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }
}, [errors]);


    const onSubmit = async (data) => {
        try {
            const response = await saveProfile(data, setError); // 🔥 FIX

            setUser(response.user);

            reset({
                firstname: response.user.firstname,
                lastname: response.user.lastname,
                username: response.user.username,
                phone: response.user.phone,
            });

        } catch (error) {
            console.log(error);
        }
    };


    if (fetchLoading) {
        return (
            <>
                <Navbar />
                <Container className="py-20">
                    <Loader />
                </Container>
            </>
        );
    }

    // ======================================

    return (
        <div className="min-h-screen bg-[#F8FAF7]">

            <Navbar />

            {/* ✅ Toast */}
            <Toast
                message={toast.message}
                show={toast.show}
                onClose={hideToast}
            />

            <Container className="py-10">

                {/* Heading */}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Profile
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your personal information and account settings.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">

                        {/* Sidebar */}
                        <ProfileSidebar user={user} />

                        {/* Right */}
                        <div className="space-y-6">

                            <PersonalInformation
                                register={(name) =>
                                    register(name, {
                                        onChange: () => clearErrors(name), // 🔥 FIX
                                    })
                                }
                                errors={errors}
                                email={user?.email}
                            />

                            <AccountSettings />

                        </div>

                    </div>

                    <SaveChangesBar
                        visible={isDirty}
                        saving={saveLoading}
                        onSave={handleSubmit(onSubmit)}
                        onCancel={() =>
                            reset({
                                firstname: user.firstname,
                                lastname: user.lastname,
                                username: user.username,
                                phone: user.phone,
                            })
                        }
                    />

                </form>

            </Container>

        </div>
    );
}