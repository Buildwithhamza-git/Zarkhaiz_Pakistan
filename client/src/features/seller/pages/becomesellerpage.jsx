import Navbar from "../../home/components/Navbar/Navbar";
import SellerRegistration from "../component/sellerRegistration/SellerRegistration";

export default function BecomeSellerPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <SellerRegistration />
        </div>
    );
}