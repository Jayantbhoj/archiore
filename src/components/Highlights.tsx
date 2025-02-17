"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BackgroundLines } from './ui/BackgroundLines';
import Link from 'next/link';

const HighlightsSection = () => {
  const router = useRouter();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
  };
  return (
    <>
      {/* First Section: Highlights Section */}
      <section className="h-screen bg-myWhite flex items-center">
        <div className="container mx-auto flex flex-col lg:flex-row items-center px-6 gap-x-12">
          {/* Left Side - Image Collage */}
          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Image 
                  src="/hero1.jpg" 
                  alt="Student Architecture Portfolio 1" 
                  width={300} 
                  height={300} 
                  className="rounded-lg"
                />
                <Image 
                  src="/hero2.jpg" 
                  alt="Student Architecture Portfolio 2" 
                  width={300} 
                  height={300} 
                  className="rounded-lg mt-4"
                />
              </div>
              <div>
                <Image 
                  src="/hero3.jpg" 
                  alt="Student Portfolio Design 1" 
                  width={300} 
                  height={300} 
                  className="rounded-lg"
                />
                <Image 
                  src="/hero1.jpg" 
                  alt="Student Portfolio Design 2" 
                  width={300} 
                  height={300} 
                  className="rounded-lg mt-4"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h2 className="text-4xl font-bold text-[#0B0A09] mb-6">
              Showcase Your  Portfolio
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Join a community of architects. Share your portfolio, showcase your projects, and gain feedback from peers. Discover inspiring designs and plans from fellow architects to fuel your creativity.
            </p>
            <div className="flex justify-center lg:justify-start">
              <a href="/explore" className="bg-myRed text-white px-4 py-2 rounded-full mr-4">
                Explore Portfolios
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Second Section: Portfolio Showcase with Black Background */}
      <section className="bg-black py-16">
        <div className="container mx-auto flex flex-col lg:flex-row items-center px-6 gap-x-12">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2 w-full text-center lg:text-left text-white">
            <h2 className="text-4xl font-bold mb-6">
              Featured Projects and Plans
            </h2>
            <p className="text-lg mb-6">
              Explore a curated collection of portfolios and projects. See how architects express their creativity through design, materials, and innovative ideas. This platform is designed to inspire and share knowledge.
            </p>
          </div>

          {/* Right Side - Image Gallery */}
          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
            <div>
              <Image 
                src="/plan1.jpg" 
                alt="Portfolio Project 1" 
                width={300} 
                height={300} 
                className="rounded-lg"
              />
              <Image 
                src="/plan2.jpg" 
                alt="Portfolio Project 2" 
                width={300} 
                height={300} 
                className="rounded-lg mt-4"
              />
            </div>
            <div>
              <Image 
                src="/plan3.jpg" 
                alt="Portfolio Project 3" 
                width={300} 
                height={300} 
                className="rounded-lg"
              />
              <Image 
                src="/plan4.jpg" 
                alt="Portfolio Project 4" 
                width={300} 
                height={300} 
                className="rounded-lg mt-4"
              />
            </div>
          </div>
        </div>
      </section>
       {/* First Section: See It, Make It, Do It */}
       <section className="h-screen bg-myWhite flex items-center">
        <div className="container mx-auto flex flex-col lg:flex-row items-center px-6 gap-x-12">
          {/* Left Side - Image */}
          <div className="lg:w-1/2 w-full flex justify-center">
            <Image 
              src="/seeIt.jpg" 
              alt="Architectural Design Inspiration" 
              width={700} 
              height={700} 
              className="rounded-lg"
            />
          </div>

          {/* Right Side - Text Content */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h2 className="text-4xl font-bold text-[#0B0A09] mb-6">
              See It, Make It, Do It
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Dive into the world of architecture. Visualize your ideas, create stunning designs, and bring your concepts to life. Join a vibrant community and showcase your talent.
            </p>
            <div className="flex justify-center lg:justify-start">
              <a href="/explore" className="bg-myRed text-white px-4 py-2 rounded-full mr-4">
                Explore Designs
              </a>
            </div>
          </div>
        </div>
      </section>

      
    <section className="relative bg-myBlack py-32">
      {/* Background Images with Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex w-full opacity-30 space-x-4">
          <Image 
            src="/carousel1.jpg" 
            alt="Background Image 1" 
            width={100} 
            height={600} 
            className="object-cover h-[400px] w-full rounded-lg" 
          />
          <Image 
            src="/carousel2.jpg" 
            alt="Background Image 2" 
            width={100} 
            height={600} 
            className="object-cover h-[400px] w-full rounded-lg" 
          />
          <Image 
            src="/carousel3.jpg" 
            alt="Background Image 3" 
            width={100} 
            height={600} 
            className="object-cover h-[400px] w-full rounded-lg" 
          />
          <Image 
            src="/carousel4.jpg" 
            alt="Background Image 4" 
            width={100} 
            height={600} 
            className="object-cover h-[400px] w-full rounded-lg" 
          />
          <Image 
            src="/carousel5.jpg" 
            alt="Background Image 4" 
            width={100} 
            height={600} 
            className="object-cover h-[400px] w-full rounded-lg" 
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Signup Section Content */}
      <div className="relative container mx-auto flex flex-col lg:flex-row items-center px-6 gap-x-12">
        {/* Left Side - Text CTA */}
        <div className="lg:w-1/2 w-full text-white text-center lg:text-left">
          <h2 className="text-4xl font-bold mb-4">Join Our Architecture Community</h2>
          <p className="text-lg mb-6">
            Sign up today and get your ideas.
          </p>
          <a 
            href="/signup" 
            className="bg-myRed text-white px-6 py-3 rounded-md inline-block hover:bg-white hover:text-black transition-colors duration-200"
          >
            Get Started
          </a>
        </div>

        {/* Right Side - Slim Signup Card */}
        <div className="lg:w-1/2 w-full bg-white rounded-lg shadow-lg p-24 text-center transform transition hover:scale-105 max-w-md mx-auto">
          <div className="mb-6 text-center">
            <Image 
              src="/logosmall.png" 
              alt="Logo" 
              width={80} 
              height={40} 
              className='mx-auto rounded-full'
            />
          </div>
          <h2 className="text-2xl font-bold text-[#0B0A09] mb-4">Welcome to Archiore</h2>
          <p className="text-sm mb-4">
              Find new ideas to try
          </p>
          
            <button
              type="submit"
              className="bg-myRed text-white py-2 px-12 rounded-md hover:bg-black  transition-colors duration-200"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Already have an account? 
              <a href="/signin" className="text-myRed font-medium hover:text-gray-800"> Log In</a>
            </p>

        </div>
      </div>

    </section>
    <footer className="bg-black py-4">
  <div className="container mx-auto flex justify-center items-center text-white">
    <p className="text-sm mr-6">
      &copy; {new Date().getFullYear()} 
    </p>
    <p className="text-sm mr-6">
      Archiore. 
    </p>
    <p className="text-sm mr-6">
      All Rights Reserved. 
    </p>

    <div>
      <a href="/terms" className="text-sm hover:text-gray-400 mx-2">Terms</a>
      <a href="/privacy" className="text-sm hover:text-gray-400 mx-2">Privacy</a>
      <a href="/contact" className="text-sm hover:text-gray-400 mx-2">Contact</a>
    </div>
  </div>

</footer>

    </>
  );
};

export default HighlightsSection;

