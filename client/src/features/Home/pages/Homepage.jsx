import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Stats from "../components/Hero/Herostat";
// import Categories from "../components/Categories";
// import FeaturedProducts from "../components/FeaturedProducts";
// import PromoBanner from "../components/PromoBanner";
// import AgricultureSupplies from "../components/AgricultureSupplies";
// import WhyChooseUs from "../components/WhyChooseUs";
// import HowItWorks from "../components/HowItWorks";
// import AIFeatures from "../components/AIFeatures";
// import Testimonials from "../components/Testimonials";
// import Footer from "../components/Footer";



export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#F8FAF7]">
            <Navbar />
            <main className="pb-28">
                <Hero />
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