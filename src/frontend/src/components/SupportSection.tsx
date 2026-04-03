import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";

const faqs = [
  {
    id: "faq-1",
    q: "How do I book an appointment?",
    a: "You can book an appointment online through our website's 'Book Appointment' section, or call us at 9732411070 / 6294215788. We're available Mon–Sat 7:00 AM – 8:00 PM and Sunday 8:00 AM – 1:00 PM.",
  },
  {
    id: "faq-2",
    q: "How long does it take to get my test reports?",
    a: "Most routine blood test reports are ready within 6–8 hours. Specialized tests like HPLC, Hormone panels, or Culture tests may take 24–72 hours. Our team will inform you of the expected turnaround time at the time of collection.",
  },
  {
    id: "faq-3",
    q: "Do you offer home sample collection?",
    a: "Yes, we offer home sample collection service for most tests. Please call 9732411070 or WhatsApp us to schedule a home visit at a convenient time.",
  },
  {
    id: "faq-4",
    q: "What payment methods do you accept?",
    a: "We accept cash, UPI (Google Pay, PhonePe, Paytm), and net banking. Payment is collected at the time of sample collection.",
  },
  {
    id: "faq-5",
    q: "Can I search for a specific test and its price?",
    a: "Yes! Visit the 'Test Prices' tab in our Appointments section to search any test by name, view its price, and book instantly.",
  },
  {
    id: "faq-6",
    q: "Do you provide doctor consultation?",
    a: "Yes, we have specialist doctors visiting on scheduled days. Check our 'Doctors' section for the full list and their available days and times.",
  },
  {
    id: "faq-7",
    q: "How do I cancel or reschedule an appointment?",
    a: "To cancel or reschedule, please call us at 9732411070 or WhatsApp us as early as possible so we can accommodate your request.",
  },
  {
    id: "faq-8",
    q: "Are your test results accurate and certified?",
    a: "Yes, all our tests are conducted by qualified technicians using NABL-standard equipment. Our results are accurate, reliable, and used by doctors across the region.",
  },
];

export default function SupportSection() {
  return (
    <section id="support" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-kdc-teal text-sm font-semibold uppercase tracking-widest">
            Help Centre
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-kdc-navy mt-2">
            Support &amp; FAQ
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Frequently asked questions
          </p>
          <div className="w-16 h-1 bg-kdc-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            data-ocid="support.panel"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border rounded-xl px-4 shadow-sm bg-kdc-light/50"
                data-ocid={`support.item.${index + 1}`}
              >
                <AccordionTrigger className="text-kdc-navy font-semibold text-left hover:text-kdc-blue hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Need more help card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 rounded-2xl bg-gradient-to-br from-kdc-navy to-kdc-blue p-8 text-white text-center"
          data-ocid="support.card"
        >
          <h3 className="text-xl font-bold mb-2">Need more help?</h3>
          <p className="text-white/70 text-sm mb-6">
            Our team is ready to assist you. Reach out via WhatsApp or give us a
            call.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-green-500 hover:bg-green-600 text-white border-none"
              data-ocid="support.primary_button"
            >
              <a
                href="https://wa.me/919732411070?text=Hello%2C%20I%20need%20support%20from%20Khanakul%20Diagnostic%20Centre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
              data-ocid="support.secondary_button"
            >
              <a href="tel:9732411070" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call 9732411070
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
