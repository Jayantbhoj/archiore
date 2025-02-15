import DelayedRender from "@/components/DelayedRender";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import LandingNavbar from "@/components/LandingNavbar";


export default function Home() {
  return (
    <div className="bg-myWhite">

      <LandingNavbar/>
      <Hero/>
      <Highlights/>
    </div>
  );
}
