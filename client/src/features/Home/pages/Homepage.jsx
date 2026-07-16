import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Stats from "../components/Hero/Herostat";
import FeaturedProductSection from "../components/products/featuredproductsection";



export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#F8FAF7]">
            <Navbar />
            <main className="pb-28">
                <Hero />
                <FeaturedProductSection />
            </main>



            {/* <main className="max-w-7xl mx-auto px-6 py-20">
                <h1 className="text-5xl font-bold text-green-800">
                    Welcome to Zarkhaiz Pakistan
                </h1>

                <p className="mt-4 text-xl text-gray-600">
                    Hero Section Coming Next...
                </p>
            </main> */}
        </div>
    );
}