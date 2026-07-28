import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import HeroStats from "../components/Hero/Herostat"
import AboutSection from "../components/About/AboutSection";
import CategorySection from "../components/category/categorySection";
import FeaturedProductSection from "../components/products/featuredproductsection";
import WhyChooseZarkhaiz from "../components/WhyChooseZarkhaiz/WhyChooseZarkhaiz";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer/Footer";

export default function HomePage() {
    const location = useLocation();

   useEffect(() => {

     window.scrollTo({
    top: 0,
    behavior: "smooth", 
  });

    if (location.hash === "#about") {
        const section = document.getElementById("about");

        if (section) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: "smooth" });

                // ✅ REMOVE HASH after scrolling (prevents refresh issue)
                window.history.replaceState(null, "", window.location.pathname);
            }, 100);
        }
    }
}, [location]);

    return (
        <div className="min-h-screen bg-[#F8FAF7]">
            <Navbar />

            <main className="bg-white pb-12">
                <Hero />
                {/* <HeroStats/> */}
                <CategorySection />
                <FeaturedProductSection />
                <WhyChooseZarkhaiz />
                <HowItWorks />

                {/* IMPORTANT: Add ID here */}
                <div id="about">
                    <AboutSection />
                </div>
                <FAQ />
            </main>

            <Footer />
        </div>
    );
}