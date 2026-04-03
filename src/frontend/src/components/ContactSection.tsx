import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetContactInfo } from "../hooks/useQueries";

const fallbackContact = {
  address: "Ramnagar, Khanakul, Hooghly, West Bengal - 712406",
  phone: "9732411070 / 6294215788",
  email: "khanakuldiagnosticcentre25@gmail.com",
};

export default function ContactSection() {
  const { data: contactInfo } = useGetContactInfo();
  const contact = contactInfo ?? fallbackContact;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    message?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(phone.trim()))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setName("");
    setPhone("");
    setMessage("");
    toast.success("Thank you! We'll get back to you shortly.");
  };

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
                <p className="text-muted-foreground text-sm">9732411070</p>
                <p className="text-muted-foreground text-sm">6294215788</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-kdc-blue/10 flex items-center justify-center text-kdc-blue flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-kdc-navy mb-1">Email</h4>
                <a
                  href="mailto:khanakuldiagnosticcentre25@gmail.com"
                  className="text-muted-foreground text-sm hover:text-kdc-blue transition-colors"
                >
                  khanakuldiagnosticcentre25@gmail.com
                </a>
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

          {/* Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-kdc-light border border-border p-6 md:p-8"
          >
            <h3 className="text-xl font-bold text-kdc-navy mb-1">
              Send an Enquiry
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Fill in the form and we'll get back to you.
            </p>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
              data-ocid="contact.modal"
            >
              <div>
                <Label
                  htmlFor="contact-name"
                  className="text-kdc-navy font-medium"
                >
                  Full Name
                </Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="e.g. Amit Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  data-ocid="contact.input"
                />
                {errors.name && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="contact.error_state"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="contact-phone"
                  className="text-kdc-navy font-medium"
                >
                  Phone Number
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                  data-ocid="contact.input"
                />
                {errors.phone && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="contact.error_state"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="contact-message"
                  className="text-kdc-navy font-medium"
                >
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 min-h-[100px] resize-none"
                  data-ocid="contact.textarea"
                />
                {errors.message && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="contact.error_state"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-kdc-blue hover:bg-kdc-navy text-white"
                data-ocid="contact.submit_button"
              >
                {submitting ? "Sending..." : "Send Enquiry"}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-border text-center">
              <a
                href="https://maps.google.com/?q=Ramnagar+Khanakul+Hooghly+West+Bengal+712406"
                target="_blank"
                rel="noopener noreferrer"
                className="text-kdc-blue text-sm font-semibold hover:text-kdc-teal transition-colors"
                data-ocid="contact.link"
              >
                View on Google Maps →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
