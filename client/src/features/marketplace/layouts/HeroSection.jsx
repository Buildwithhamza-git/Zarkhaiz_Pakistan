import heroImage from "../../../assets/images/hero/img1.png";

const HeroSection = () => {
  return (
    <section className="relative h-[260px] overflow-hidden">
      <img src={heroImage} alt="Products banner" className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-800/80 to-green-900/30" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">All Products</h1>
        <p className="mt-3 max-w-xl text-sm text-green-50 sm:text-base">
          Browse thousands of quality agricultural products from trusted sellers across Pakistan.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;