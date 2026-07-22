import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";
import Loader from "../../../shared/components/ui/Loader";

import useAuthContext from "../../../hooks/useAuth";
import { saveUser } from "../../../utlis/storage";

import useProfile from "../hooks/useProfile";
import { profileSchema } from "../validations/profileValidation";

import ProfileSidebar from "../components/ProfileSidebar";
import PersonalInformation from "../components/PersonalInformation";
import AddressInformation from "../components/AddressInformation";
import AccountSettings from "../components/AccountSettings";
import SaveChangesBar from "../components/SaveChangesBar";

// yyyy-MM-dd, the format the native <input type="date" /> expects.
const toDateInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
};

const toFormValues = (profileUser) => ({
    firstname: profileUser?.firstname || "",
    lastname: profileUser?.lastname || "",
    username: profileUser?.username || "",
    phone: profileUser?.phone || "",
    dateOfBirth: toDateInputValue(profileUser?.dateOfBirth),
    address: profileUser?.address || "",
    city: profileUser?.city || "",
    province: profileUser?.province || "",
    postalCode: profileUser?.postalCode || "",
    country: profileUser?.country || "Pakistan",
});

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, token, setUser } = useAuthContext();

    const {
        fetchProfile,
        saveProfile,
        uploadAvatar,
        fetchLoading,
        saveLoading,
        avatarLoading,
    } = useProfile();

    const [profileUser, setProfileUser] = useState(null);
    const [avatarError, setAvatarError] = useState("");
    const [pageError, setPageError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: toFormValues(null),
    });

    // Route guard: profile requires an authenticated user.
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    // Load the freshest profile data from the server on mount.
    useEffect(() => {
        if (!token) return;

        let isMounted = true;

        (async () => {
            try {
                const result = await fetchProfile();
                const freshUser = result.user || result.payload?.user;

                if (isMounted && freshUser) {
                    setProfileUser(freshUser);
                    reset(toFormValues(freshUser));
                }
            } catch (error) {
                if (isMounted) {
                    setPageError(error.message || "Failed to load your profile");
                }
            }
        })();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const syncUser = (updatedUser) => {
        setProfileUser(updatedUser);
        setUser(updatedUser);
        saveUser(updatedUser);
    };

    const onSubmit = async (data) => {
        try {
            const result = await saveProfile(data);
            const updatedUser = result.user || result.payload?.user;

            syncUser(updatedUser);
            reset(toFormValues(updatedUser));
            toast.success("Profile updated successfully");
        } catch (error) {
            if (error.errors) {
                error.errors.forEach((err) => {
                    setError(err.field, { type: "server", message: err.message });
                });
                return;
            }

            toast.error(error.message || "Failed to update profile");
            if (error.field) {
                setError(error.field, { type: "server", message: error.message });
            }
        }
    };

    const handleCancel = () => {
        reset(toFormValues(profileUser));
    };

    const handleAvatarUpload = async (file, validationError) => {
        if (validationError) {
            setAvatarError(validationError);
            return;
        }

        setAvatarError("");

        try {
            const result = await uploadAvatar(file);
            const updatedUser = result.user || result.payload?.user;

            syncUser(updatedUser);
            toast.success("Profile photo updated");
        } catch (error) {
            setAvatarError(error.message || "Failed to upload photo");
        }
    };

    if (!token) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F8FAF7]">
            <Navbar />

            <Container className="py-10">
                <nav className="text-sm text-gray-500 mb-2">
                    Home <span className="mx-1">›</span> My Account <span className="mx-1">›</span>
                    <span className="text-green-700 font-medium">Profile</span>
                </nav>

                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 mt-1">
                    Manage your personal information and account settings
                </p>

                {fetchLoading && !profileUser ? (
                    <div className="mt-10">
                        <Loader text="Loading your profile..." />
                    </div>
                ) : pageError && !profileUser ? (
                    <div className="mt-10 bg-white border rounded-2xl p-8 text-center text-red-500">
                        {pageError}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
                            <ProfileSidebar
                                user={profileUser || user}
                                onAvatarUpload={handleAvatarUpload}
                                avatarUploading={avatarLoading}
                                avatarError={avatarError}
                            />

                            <div className="space-y-6">
                                <PersonalInformation
                                    register={register}
                                    errors={errors}
                                    email={profileUser?.email || user?.email}
                                />

                                <AddressInformation
                                    register={register}
                                    errors={errors}
                                />

                                <AccountSettings />
                            </div>
                        </div>

                        <SaveChangesBar
                            visible={isDirty}
                            saving={saveLoading}
                            onSave={handleSubmit(onSubmit)}
                            onCancel={handleCancel}
                        />
                    </form>
                )}
            </Container>
        </div>
    );
}
