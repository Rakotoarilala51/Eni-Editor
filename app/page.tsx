import HeroSection from "@/components/LandingPage/HeroSection";
import NavBar from "@/components/LandingPage/NavBar";
import { PseudoAlgoIDE } from "@/components/pseudo-algo-ide";

export default function Home() {
  return (
    <div className="px-12">
      <NavBar />
      {/* <PseudoAlgoIDE /> */}
      <HeroSection />
    </div>
  );
}
