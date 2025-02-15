import Link from 'next/link';

const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center text-[#FFF8F0] min-h-screen py-60 px-20"
      style={{ backgroundImage: 'url(/hero1.jpg)' }}
    >
      <div className="absolute inset-0 bg-[#0B0A09] opacity-70"></div>
      <div className="relative container mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold  mb-6">
        Inspiration Awaits.
        </h1>
        <p className="text-xl mb-8">
          Join a community of architects sharing their work, learning from each other, and showcasing their portfolios.
        </p>
        <div className="flex space-x-4">
          <Link href="/explore">
            <span className="bg-[#EC0B43] text-white px-6 py-3 rounded-md text-lg cursor-pointer hover:bg-[#D00A3A]">
              Start Exploring
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
