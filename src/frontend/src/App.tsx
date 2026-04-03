import { Toaster } from "@/components/ui/sonner";
import BookAppointmentSection from "./components/BookAppointmentSection";
import ContactSection from "./components/ContactSection";
import DoctorsSection from "./components/DoctorsSection";
import Footer from "./components/Footer";
import GallerySection from "./components/GallerySection";
import HealthPackagesSection from "./components/HealthPackagesSection";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ServicesSection from "./components/ServicesSection";
import SupportSection from "./components/SupportSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";

export default function App() {
  return (
    <div className="min-h-screen">
      <Toaster />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <HealthPackagesSection />
        <DoctorsSection />
        <WhyChooseUsSection />
        <BookAppointmentSection />
        <GallerySection />
        <ContactSection />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
}
