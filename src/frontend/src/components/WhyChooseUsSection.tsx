import { BadgeCheck, Cpu, Home, Users } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: BadgeCheck,
    title: "Accurate Results",
    description:
      "State-of-the-art equipment and stringent quality control protocols ensure diagnostic accuracy you can trust.",
  },
  {
    icon: Cpu,
    title: "Modern Technology",
    description:
      "Fully automated analyzers and digital imaging systems for faster, more precise test results.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description:
      "Our qualified doctors, pathologists and technicians bring decades of combined diagnostic expertise.",
  },
  {
    icon: Home,
    title: "Home Collection",
    description:
      "Convenient home sample collection service available across Khanakul and nearby areas.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section id="about" className="py-20 bg-kdc-navy">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-kdc-teal text-sm font-semibold uppercase tracking-widest">
            Our Strengths
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Why Choose Us?
          </h2>
          <div className="w-16 h-1 bg-kdc-teal rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-kdc-teal/20 border border-kdc-teal/30 flex items-center justify-center mx-auto mb-5 text-kdc-teal">
                <feat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
