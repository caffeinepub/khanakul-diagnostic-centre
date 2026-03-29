import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { useGetDoctors } from "../hooks/useQueries";

const doctorImages = [
  "/assets/generated/doctor-1.dim_400x400.jpg",
  "/assets/generated/doctor-2.dim_400x400.jpg",
  "/assets/generated/doctor-3.dim_400x400.jpg",
];

const fallbackDoctors = [
  {
    name: "Dr. Sudipta Chakraborty",
    specialty: "Pathologist",
    qualification: "MBBS, MD (Pathology)",
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    name: "Dr. Priya Mondal",
    specialty: "Radiologist",
    qualification: "MBBS, MD (Radiology)",
    availabilityDays: ["Mon", "Wed", "Fri", "Sat"],
  },
  {
    name: "Dr. Rajesh Kumar Sen",
    specialty: "General Physician",
    qualification: "MBBS, PGDM",
    availabilityDays: ["Tue", "Thu", "Sat"],
  },
];

export default function DoctorsSection() {
  const { data: doctors } = useGetDoctors();
  const displayDoctors =
    doctors && doctors.length > 0 ? doctors : fallbackDoctors;

  return (
    <section id="doctors" className="py-20 bg-kdc-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-kdc-teal text-sm font-semibold uppercase tracking-widest">
            Expert Care
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-kdc-navy mt-2">
            Meet Our Expert Doctors
          </h2>
          <div className="w-16 h-1 bg-kdc-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDoctors.map((doctor, idx) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow text-center"
              data-ocid={`doctors.item.${idx + 1}`}
            >
              <div className="bg-gradient-to-b from-kdc-blue/20 to-transparent p-8 pb-0">
                <Avatar className="w-28 h-28 mx-auto border-4 border-white shadow-lg">
                  <AvatarImage
                    src={doctorImages[idx % doctorImages.length]}
                    alt={doctor.name}
                  />
                  <AvatarFallback className="bg-kdc-blue text-white text-2xl font-bold">
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-kdc-navy mb-1">
                  {doctor.name}
                </h3>
                <div className="flex items-center justify-center gap-1 text-kdc-teal font-semibold text-sm mb-1">
                  <Stethoscope className="w-4 h-4" />
                  {doctor.specialty}
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {doctor.qualification}
                </p>
                <div className="flex flex-wrap gap-1 justify-center mb-5">
                  {doctor.availabilityDays.map((day) => (
                    <span
                      key={day}
                      className="text-xs bg-kdc-blue/10 text-kdc-blue px-2 py-0.5 rounded-full font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-kdc-blue hover:bg-kdc-navy text-white"
                  data-ocid={`doctors.primary_button.${idx + 1}`}
                >
                  <a href="#appointment">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Book Appointment
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
