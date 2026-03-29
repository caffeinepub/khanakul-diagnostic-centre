import {
  ArrowRight,
  FlaskConical,
  HeartPulse,
  Home,
  ScanLine,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetServices } from "../hooks/useQueries";

const fallbackServices = [
  {
    icon: "flask",
    name: "Pathological Tests",
    description:
      "Complete blood count, biochemistry, microbiology, urine analysis and all major pathological investigations with precision.",
  },
  {
    icon: "scan",
    name: "Radiology",
    description:
      "Digital X-ray, Ultrasound, ECG and advanced imaging services with experienced radiologists interpreting results.",
  },
  {
    icon: "heart",
    name: "Health Packages",
    description:
      "Comprehensive preventive health checkup packages tailored for individuals, families, and corporate groups.",
  },
  {
    icon: "home",
    name: "Home Sample Collection",
    description:
      "Certified phlebotomists visit your home for sample collection. Safe, hygienic, and convenient service.",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  flask: <FlaskConical className="w-7 h-7" />,
  scan: <ScanLine className="w-7 h-7" />,
  heart: <HeartPulse className="w-7 h-7" />,
  home: <Home className="w-7 h-7" />,
};

function getIcon(iconStr: string, idx: number) {
  const iconKey = Object.keys(iconMap)[idx % Object.keys(iconMap).length];
  return iconMap[iconStr] ?? iconMap[iconKey];
}

export default function ServicesSection() {
  const { data: services } = useGetServices();
  const displayServices =
    services && services.length > 0 ? services : fallbackServices;

  return (
    <section id="services" className="py-20 bg-kdc-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-kdc-teal text-sm font-semibold uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-kdc-navy mt-2">
            Our Services
          </h2>
          <div className="w-16 h-1 bg-kdc-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, idx) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-card rounded-xl p-6 text-center shadow-card hover:shadow-lg transition-shadow group"
              data-ocid={`services.item.${idx + 1}`}
            >
              <div className="w-16 h-16 rounded-full bg-kdc-blue/10 flex items-center justify-center mx-auto mb-5 text-kdc-blue group-hover:bg-kdc-blue group-hover:text-white transition-colors">
                {getIcon(service.icon ?? "", idx)}
              </div>
              <h3 className="text-lg font-semibold text-kdc-navy mb-2">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <a
                href="#appointment"
                className="text-kdc-blue text-sm font-semibold inline-flex items-center gap-1 hover:text-kdc-teal transition-colors"
                data-ocid={`services.link.${idx + 1}`}
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
