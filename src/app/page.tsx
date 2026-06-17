import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Technologies from "@/components/Technologies";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Advantages from "@/components/Advantages";
import Guarantees from "@/components/Guarantees";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Technologies />
        <Projects />
        <Process />
        <Advantages />
        <Guarantees />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
