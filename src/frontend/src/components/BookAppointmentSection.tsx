import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useBookAppointment, useGetServices } from "../hooks/useQueries";

const serviceOptions = [
  "Pathological Tests",
  "Radiology / X-Ray",
  "Ultrasound",
  "ECG",
  "Health Package",
  "Home Sample Collection",
];

export default function BookAppointmentSection() {
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    serviceType: "",
    preferredDate: "",
    message: "",
  });
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { data: services } = useGetServices();
  const { mutate: bookAppointment, isPending } = useBookAppointment();

  const serviceList =
    services && services.length > 0
      ? services.map((s) => s.name)
      : serviceOptions;

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.patientName ||
      !form.phone ||
      !form.serviceType ||
      !form.preferredDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    bookAppointment(
      {
        patientName: form.patientName,
        phone: form.phone,
        email: form.email,
        serviceType: form.serviceType,
        preferredDate: form.preferredDate,
        message: form.message,
        bookingTime: BigInt(Date.now()),
      },
      {
        onSuccess: (id) => {
          setBookingId(id.toString());
          setForm({
            patientName: "",
            phone: "",
            email: "",
            serviceType: "",
            preferredDate: "",
            message: "",
          });
        },
        onError: () => {
          toast.error("Failed to book appointment. Please try again.");
        },
      },
    );
  }

  return (
    <section id="appointment" className="py-20 bg-kdc-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-kdc-teal text-sm font-semibold uppercase tracking-widest">
            Schedule a Visit
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-kdc-navy mt-2">
            Book an Appointment
          </h2>
          <div className="w-16 h-1 bg-kdc-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {bookingId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl p-10 text-center shadow-card"
              data-ocid="appointment.success_state"
            >
              <div className="w-16 h-16 rounded-full bg-kdc-teal/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9 text-kdc-teal" />
              </div>
              <h3 className="text-2xl font-bold text-kdc-navy mb-2">
                Appointment Booked!
              </h3>
              <p className="text-muted-foreground mb-4">
                Your appointment has been successfully scheduled.
              </p>
              <div className="bg-kdc-blue/5 border border-kdc-blue/20 rounded-lg px-6 py-3 inline-block">
                <span className="text-sm text-muted-foreground">
                  Booking ID:{" "}
                </span>
                <span className="font-bold text-kdc-blue">{bookingId}</span>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => setBookingId(null)}
                  className="bg-kdc-blue hover:bg-kdc-navy text-white"
                  data-ocid="appointment.secondary_button"
                >
                  Book Another Appointment
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-8 shadow-card space-y-5"
              data-ocid="appointment.modal"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    placeholder="Your full name"
                    value={form.patientName}
                    onChange={(e) =>
                      handleChange("patientName", e.target.value)
                    }
                    required
                    data-ocid="appointment.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+91 XXXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    data-ocid="appointment.input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    data-ocid="appointment.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) =>
                      handleChange("preferredDate", e.target.value)
                    }
                    required
                    data-ocid="appointment.input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Service *</Label>
                <Select
                  value={form.serviceType}
                  onValueChange={(v) => handleChange("serviceType", v)}
                >
                  <SelectTrigger data-ocid="appointment.select">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceList.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Any specific tests or additional information..."
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={3}
                  data-ocid="appointment.textarea"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-kdc-blue hover:bg-kdc-navy text-white font-semibold py-3 text-base"
                data-ocid="appointment.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Appointment"
                )}
              </Button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
