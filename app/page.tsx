import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Reality from "@/components/sections/Reality";
import Stats from "@/components/sections/Stats";
import Membership from "@/components/sections/Membership";
import Prevention from "@/components/sections/Prevention";
import Video from "@/components/sections/Video";
import Contact from "@/components/sections/Contact";
import CommunityCTA from "@/components/sections/CommunityCTA";
import CommunityPopup from "@/components/ui/CommunityPopup";
import GlassDefs from "@/components/fx/GlassDefs";

export default function Home() {
  return (
    <>
      <GlassDefs />
      <Header />
      <main>
        <Hero />
        <Reality />
        <Stats />
        <Membership />
        <Prevention />
        <CommunityCTA />
        <Video />
        <Contact />
      </main>
      <Footer />
      <CommunityPopup />
    </>
  );
}
