import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useGetHealthPackages } from "../hooks/useQueries";

const fallbackPackages = [
  {
    name: "Basic Health Checkup",
    price: BigInt(499),
    includedTests: ["CBC", "Blood Sugar", "Urine R/E", "Lipid Profile"],
  },
  {
    name: "Full Body Checkup",
    price: BigInt(1499),
    includedTests: [
      "CBC",
      "LFT",
      "KFT",
      "Thyroid",
      "Blood Sugar",
      "ECG",
      "Urine R/E",
      "Lipid Profile",
    ],
  },
  {
    name: "Cardiac Package",
    price: BigInt(2499),
    includedTests: [
      "ECG",
      "Echo",
      "Lipid Profile",
      "Troponin I",
      "CRP",
      "CBC",
      "Blood Pressure Monitoring",
    ],
  },
  {
    name: "Diabetes Screening",
    price: BigInt(799),
    includedTests: [
      "Fasting Blood Sugar",
      "HbA1c",
      "PP Blood Sugar",
      "Urine R/E",
      "Creatinine",
    ],
  },
];

export default function HealthPackagesSection() {
  const { data: packages } = useGetHealthPackages();
  const displayPackages =
    packages && packages.length > 0 ? packages : fallbackPackages;

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-kdc-teal text-sm font-semibold uppercase tracking-widest">
            Preventive Care
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-kdc-navy mt-2">
            Health Packages
          </h2>
          <div className="w-16 h-1 bg-kdc-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPackages.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-kdc-light rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow flex flex-col"
              data-ocid={`packages.item.${idx + 1}`}
            >
              <h3 className="text-lg font-bold text-kdc-navy mb-1">
                {pkg.name}
              </h3>
              <div className="text-2xl font-bold text-kdc-blue mb-4">
                ₹{Number(pkg.price)}
              </div>
              <ul className="flex-1 space-y-2 mb-6">
                {pkg.includedTests.map((test) => (
                  <li
                    key={test}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-kdc-teal flex-shrink-0" />
                    {test}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="w-full bg-kdc-blue hover:bg-kdc-navy text-white"
                data-ocid={`packages.primary_button.${idx + 1}`}
              >
                <a href="#appointment">Book Now</a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
