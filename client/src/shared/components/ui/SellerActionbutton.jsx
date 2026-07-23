import { useNavigate } from "react-router-dom";

import Button from "./button";

import { useAuth } from "../../../context/authContext"
import { useSellerContext } from "../../../context/sellerContext";

const SellerActionButton = () => {

    const navigate = useNavigate();

    const { user } = useAuth();

    const {
        seller,
        isApproved,
        isPending,
        isRejected,
    } = useSellerContext();

    // ==========================
    // Guest
    // ==========================

    if (!user) {

        return (
            <Button
                onClick={() => navigate("/login")}
            >
                Become Seller
            </Button>
        );

    }

    // ==========================
    // Buyer
    // ==========================

    if (!seller) {

        return (
            <Button
                onClick={() => navigate("/become-seller")}
            >
                Become Seller
            </Button>
        );

    }

    // ==========================
    // Pending
    // ==========================

    if (isPending) {

        return (
            <Button
                variant="warning"
                onClick={() => navigate("/seller/pending")}
            >
                Application Pending
            </Button>
        );

    }

    // ==========================
    // Rejected
    // ==========================

    if (isRejected) {

        return (
            <Button
                variant="danger"
                onClick={() => navigate("/become-seller")}
            >
                Reapply
            </Button>
        );

    }

    // ==========================
    // Approved
    // ==========================

    if (isApproved) {

        return (
            <Button
                variant="success"
                onClick={() => navigate("/seller/dashboard")}
            >
                Seller Dashboard
            </Button>
        );

    }

    return null;

};

export default SellerActionButton;