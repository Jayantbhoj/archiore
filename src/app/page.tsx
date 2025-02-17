import DelayedRender from "@/components/DelayedRender";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import LandingNavbar from "@/components/LandingNavbar";
import Head from "next/head";


export default function Home() {
  return (
  <>
        <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Archiore",
            "url": "https://archiore.com",
            "logo": "https://archiore.com/logosmall.png"
        }) }} />
      </Head>
    <div className="bg-myWhite">

      <LandingNavbar/>
      <Hero/>
      <Highlights/>
    </div>
    </>
  );
}
