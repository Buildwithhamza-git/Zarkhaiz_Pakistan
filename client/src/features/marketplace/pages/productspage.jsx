import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";
import ProductsContent from "../index";

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <Container className="py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">All Products</h1>
                <ProductsContent />
            </Container>
        </div>
    );
}