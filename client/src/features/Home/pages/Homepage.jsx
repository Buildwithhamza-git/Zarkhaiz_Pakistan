import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import AboutSection from "../components/About/AboutSection";
import CategorySection from "../components/category/categorySection";
import FeaturedProductSection from "../components/products/featuredproductsection";
import WhyChooseZarkhaiz from "../components/WhyChooseZarkhaiz/WhyChooseZarkhaiz";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer/Footer";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#F8FAF7]">
            <Navbar />

            <main className="bg-white pb-12">
                <Hero />
                <CategorySection />
                <FeaturedProductSection />
                <WhyChooseZarkhaiz />
                <HowItWorks />
                <FAQ />
                <AboutSection />
            </main>

            <Footer />
        </div>
    );
}
