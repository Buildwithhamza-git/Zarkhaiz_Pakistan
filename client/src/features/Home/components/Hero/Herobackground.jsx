import heroImage from "../../../../assets/images/hero/img1.png";

export default function HeroBackground() {
    return (
        <div className="relative h-[650px]">

            <img
                src={heroImage}
                alt="Hero"
                className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                "
            />

            {/* Left Gradient */}

            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    to-transparent
                "
            />

        </div>
    );
}