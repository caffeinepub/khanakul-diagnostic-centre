import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{
        backgroundImage: `url('/assets/generated/kdc-hero.dim_1600x900.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-kdc-navy/75" />

      {/* Content Panel */}
      <div className="relative z-10 container mx-auto px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-kdc-navy/80 backdrop-blur-sm rounded-2xl p-8 md:p-14 max-w-3xl w-full text-center border border-white/10 shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-kdc-teal/20 text-kdc-teal border border-kdc-teal/40 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest"
          >
            Trusted Since 2005
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wide leading-tight mb-4"
          >
            KHANAKUL DIAGNOSTIC CENTRE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto"
          >
            Providing Accurate Diagnostics & Compassionate Care in Khanakul
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-kdc-blue hover:bg-kdc-teal text-white font-semibold px-8 transition-colors"
              data-ocid="hero.primary_button"
            >
              <a href="#appointment">Book Appointment</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-kdc-navy font-semibold px-8 transition-colors bg-transparent"
              data-ocid="hero.secondary_button"
            >
              <a href="#services">Our Services</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
