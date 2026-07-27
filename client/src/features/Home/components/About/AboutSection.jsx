import { Link } from "react-router-dom";
import {
    ArrowRight,
    BadgeCheck,
    CloudSun,
    Eye,
    Handshake,
    Landmark,
    Leaf,
    Lightbulb,
    MapPinned,
    ShieldCheck,
    Sprout,
    Store,
    Target,
    Tractor,
    UsersRound,
} from "lucide-react";
import Card from "../../../../shared/components/ui/Card";
import Container from "../../../../shared/layouts/Container";
import aboutImage from "../../../../assets/images/hero/img1.png";

const marketplaceBenefits = [
    "Connect with farmers, buyers and verified agricultural sellers.",
    "Discover seeds, crops, fertilizers, irrigation products and farm equipment.",
    "Build trust through a structured seller registration and approval process.",
    "Access agriculture opportunities through one transparent digital marketplace.",
];

const values = [
    {
        icon: ShieldCheck,
        title: "Trust",
        description: "Verified sellers, clearer information and dependable marketplace experiences.",
    },
    {
        icon: MapPinned,
        title: "Accessibility",
        description: "Agricultural products and services made easier to discover across Pakistan.",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "Practical digital solutions that help modernize traditional agriculture.",
    },
    {
        icon: UsersRound,
        title: "Farmer Empowerment",
        description: "More choices, stronger market connections and better growth opportunities.",
    },
];

const futureServices = [
    { icon: CloudSun, label: "Weather information" },
    { icon: Landmark, label: "Government schemes" },
    { icon: Tractor, label: "Smart farming tools" },
    { icon: Handshake, label: "Expert consultation" },
];

export default function AboutSection() {
    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="scroll-mt-24 overflow-hidden bg-[#F8FAF7] py-16 sm:py-20 lg:py-24"
        >
            <Container className="relative">
                <div
                    className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-green-200/30 blur-3xl"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-yellow-100/60 blur-3xl"
                    aria-hidden="true"
                />

                <div className="relative mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
                        <Sprout size={17} aria-hidden="true" />
                        Growing Pakistan Together
                    </span>

                    <h2
                        id="about-heading"
                        className="mt-5 text-3xl font-extrabold tracking-tight text-[#123D22] sm:text-4xl lg:text-5xl"
                    >
                        About Zarkhaiz Pakistan
                    </h2>

                    <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
                        Zarkhaiz Pakistan is a digital agriculture marketplace built to connect
                        farmers, buyers, verified sellers, agricultural experts and other
                        stakeholders through a more trusted, accessible and modern platform.
                    </p>
                </div>

                <div className="relative mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-green-700">
                            One connected agriculture ecosystem
                        </p>

                        <h3 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                            Making agricultural trade simpler, safer and more transparent.
                        </h3>

                        <p className="mt-5 leading-7 text-gray-600">
                            Our platform helps people discover essential agricultural products,
                            compare trusted options and build meaningful connections across the
                            farming community. Sellers receive a structured onboarding journey,
                            while buyers gain access to a wider and more reliable marketplace.
                        </p>

                        <ul className="mt-7 space-y-4">
                            {marketplaceBenefits.map((benefit) => (
                                <li key={benefit} className="flex items-start gap-3 text-gray-700">
                                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green-100 text-green-700">
                                        <BadgeCheck size={17} aria-hidden="true" />
                                    </span>
                                    <span className="leading-7">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                            >
                                Explore Marketplace
                                <ArrowRight size={18} aria-hidden="true" />
                            </Link>

                            
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-xl">
                        <div className="overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl shadow-green-950/15">
                            <img
                                src={aboutImage}
                                alt="Pakistani farmer harvesting wheat in an agricultural field"
                                className="h-[360px] w-full object-cover object-[68%_center] sm:h-[440px]"
                            />
                            <div className="absolute inset-2 rounded-[1.55rem] bg-gradient-to-t from-[#0F2818]/55 via-transparent to-transparent" />
                        </div>

                        <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs">
                            <div className="flex items-center gap-3">
                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
                                    <Leaf size={23} aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Digital-first agriculture</p>
                                    <p className="mt-1 text-sm leading-5 text-gray-500">
                                        Connecting opportunity with the people who grow Pakistan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-3 top-7 hidden rounded-2xl bg-[#123D22] px-4 py-3 text-white shadow-xl sm:block">
                            <p className="text-xs font-semibold uppercase tracking-wider text-green-200">
                                Marketplace
                            </p>
                            <p className="mt-1 font-bold">Verified &amp; Accessible</p>
                        </div>
                    </div>
                </div>

                <div className="relative mt-20 grid gap-5 md:grid-cols-2">
                    <Card className="border-green-100 p-7 shadow-md shadow-green-950/5 sm:p-8">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-700 text-white">
                            <Target size={23} aria-hidden="true" />
                        </div>
                        <h3 className="mt-5 text-xl font-bold text-gray-900">Our Mission</h3>
                        <p className="mt-3 leading-7 text-gray-600">
                            To create a trusted digital marketplace that improves access to
                            agricultural products, supports verified sellers and gives farmers and
                            buyers stronger connections across Pakistan.
                        </p>
                    </Card>

                    <Card className="border-yellow-100 p-7 shadow-md shadow-green-950/5 sm:p-8">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-yellow-500 text-[#123D22]">
                            <Eye size={23} aria-hidden="true" />
                        </div>
                        <h3 className="mt-5 text-xl font-bold text-gray-900">Our Vision</h3>
                        <p className="mt-3 leading-7 text-gray-600">
                            To help modernize Pakistan&apos;s agricultural ecosystem through useful
                            digital solutions, better transparency and future-ready services for
                            every stakeholder.
                        </p>
                    </Card>
                </div>

                <div className="relative mt-16">
                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-green-700">
                            What guides us
                        </p>
                        <h3 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                            Values behind the Zarkhaiz experience
                        </h3>
                    </div>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value) => {
                            const Icon = value.icon;

                            return (
                                <Card
                                    key={value.title}
                                    className="group border-green-100 p-6 transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
                                >
                                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-green-100 text-green-700 transition group-hover:bg-green-700 group-hover:text-white">
                                        <Icon size={21} aria-hidden="true" />
                                    </div>
                                    <h4 className="mt-4 font-bold text-gray-900">{value.title}</h4>
                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        {value.description}
                                    </p>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                <div className="relative mt-16 overflow-hidden rounded-3xl bg-[#123D22] px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10">
                    <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">
                                Built for the future
                            </p>
                            <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                                More than a marketplace
                            </h3>
                            <p className="mt-3 leading-7 text-green-50/80">
                                Zarkhaiz Pakistan is designed to grow into a complete digital
                                support system for agriculture.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {futureServices.map((service) => {
                                const Icon = service.icon;

                                return (
                                    <div
                                        key={service.label}
                                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4"
                                    >
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-green-200">
                                            <Icon size={20} aria-hidden="true" />
                                        </span>
                                        <span className="font-semibold">{service.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
