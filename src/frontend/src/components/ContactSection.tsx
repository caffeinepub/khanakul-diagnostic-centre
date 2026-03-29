import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useGetContactInfo } from "../hooks/useQueries";

const fallbackContact = {
  address: "Near Khanakul Bus Stand, Khanakul, Hooghly, West Bengal - 712409",
  phone: "+91 94320 XXXXX",
  email: "info@khanakuldiagnostic.com",
};

export default function ContactSection() {
  const { data: contactInfo } = useGetContactInfo();
  const contact = contactInfo ?? fallbackContact;

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-kdc-teal text-sm font-semibold uppercase tracking-widest">
            Reach Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-kdc-navy mt-2">
            Contact Us
          </h2>
          <div className="w-16 h-1 bg-kdc-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-kdc-blue/10 flex items-center justify-center text-kdc-blue flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-kdc-navy mb-1">Address</h4>
                <p className="text-muted-foreground text-sm">
                  {contact.address}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-kdc-blue/10 flex items-center justify-center text-kdc-blue flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-kdc-navy mb-1">Phone</h4>
                <p className="text-muted-foreground text-sm">{contact.phone}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-kdc-blue/10 flex items-center justify-center text-kdc-blue flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-kdc-navy mb-1">Email</h4>
                <p className="text-muted-foreground text-sm">{contact.email}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-kdc-blue/10 flex items-center justify-center text-kdc-blue flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-kdc-navy mb-1">
                  Working Hours
                </h4>
                <p className="text-muted-foreground text-sm">
                  Mon – Sat: 7:00 AM – 8:00 PM
                </p>
                <p className="text-muted-foreground text-sm">
                  Sunday: 8:00 AM – 1:00 PM
                </p>
              </div>
            </div>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden h-80 lg:h-auto bg-kdc-light border border-border flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="w-12 h-12 text-kdc-blue mx-auto mb-3" />
              <p className="text-kdc-navy font-semibold">
                Khanakul Diagnostic Centre
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Khanakul, Hooghly, West Bengal
              </p>
              <a
                href="https://maps.google.com/?q=Khanakul+Hooghly+West+Bengal"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-kdc-blue text-sm font-semibold hover:text-kdc-teal transition-colors"
                data-ocid="contact.link"
              >
                Open in Google Maps →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
