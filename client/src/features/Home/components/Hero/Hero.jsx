import HeroBackground from "./Herobackground";
import HeroContent from "./Herocontent";
import HeroStats from "./Herostat";

export default function Hero() {
    return (
        <section className="relative">

            <HeroBackground />

            <HeroContent />

            <HeroStats />

        </section>
    );
}