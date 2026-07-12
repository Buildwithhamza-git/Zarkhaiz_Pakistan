import HeroButtons from "./herobuttons";
import HeroFeatures from "./Herofeatures";

export default function HeroContent() {
    return (
        <div
            className="
                absolute
                inset-0
                z-20
                flex
                items-center
            "
        >
            <div className="max-w-7xl mx-auto w-full px-6">

                <div className="max-w-2xl">

                    <h1
                        className="
                            text-6xl
                            font-extrabold
                            text-green-800
                            leading-tight
                        "
                    >
                        Grow Together
                    </h1>

                    <p
                        className="
                            mt-6
                            text-xl
                            text-gray-700
                            leading-9
                        "
                    >
                        Buy directly from trusted farmers and verified
                        agricultural sellers across Pakistan.
                    </p>

                    <HeroFeatures />

                    <HeroButtons />

                </div>

            </div>

        </div>
    );
}