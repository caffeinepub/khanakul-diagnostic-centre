import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Loader2,
  MessageCircle,
  Phone,
  Search,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppointmentWithId } from "../backend.d";
import {
  useBookAppointment,
  useGetAppointmentsByPhone,
  useGetServices,
} from "../hooks/useQueries";

const WHATSAPP_NUMBERS = [
  { number: "919732411070", label: "9732411070" },
  { number: "918972128129", label: "8972128129" },
];
const CLINIC_ADDRESS = "Ramnagar, Khanakul, Hooghly - 712406";
const CLINIC_NAME = "Khanakul Diagnostic Centre";

function buildWhatsAppUrl(
  waNumber: string,
  details: {
    bookingId: string;
    patientName: string;
    serviceType: string;
    preferredDate: string;
    phone: string;
  },
) {
  const msg = `Appointment Confirmed!\nBooking ID: #${details.bookingId}\nPatient: ${details.patientName}\nService: ${details.serviceType}\nDate: ${details.preferredDate}\nPhone: ${details.phone}\n\n${CLINIC_NAME}\n${CLINIC_ADDRESS}`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}

const serviceOptions = [
  "Pathological Tests",
  "Radiology / X-Ray",
  "Ultrasound",
  "ECG",
  "Health Package",
  "Home Sample Collection",
];

// Single test catalogue with prices
const TEST_CATALOGUE = [
  // Blood Tests
  { name: "Complete Blood Count (CBC)", category: "Blood Test", price: 150 },
  { name: "Blood Sugar Fasting (BSF)", category: "Blood Test", price: 60 },
  { name: "Blood Sugar PP", category: "Blood Test", price: 60 },
  { name: "Random Blood Sugar", category: "Blood Test", price: 60 },
  { name: "HbA1c (Glycated Haemoglobin)", category: "Blood Test", price: 350 },
  { name: "Haemoglobin (Hb)", category: "Blood Test", price: 50 },
  { name: "ESR", category: "Blood Test", price: 60 },
  { name: "Blood Group & Rh Factor", category: "Blood Test", price: 80 },
  // Liver & Kidney
  { name: "Liver Function Test (LFT)", category: "Liver & Kidney", price: 400 },
  {
    name: "Kidney Function Test (KFT)",
    category: "Liver & Kidney",
    price: 400,
  },
  { name: "Serum Creatinine", category: "Liver & Kidney", price: 120 },
  { name: "Serum Uric Acid", category: "Liver & Kidney", price: 120 },
  { name: "Blood Urea", category: "Liver & Kidney", price: 100 },
  { name: "SGOT (AST)", category: "Liver & Kidney", price: 120 },
  { name: "SGPT (ALT)", category: "Liver & Kidney", price: 120 },
  { name: "Bilirubin Total & Direct", category: "Liver & Kidney", price: 150 },
  // Lipid & Heart
  { name: "Lipid Profile", category: "Lipid & Heart", price: 350 },
  { name: "Total Cholesterol", category: "Lipid & Heart", price: 120 },
  { name: "Triglycerides", category: "Lipid & Heart", price: 120 },
  { name: "HDL Cholesterol", category: "Lipid & Heart", price: 120 },
  { name: "LDL Cholesterol", category: "Lipid & Heart", price: 120 },
  { name: "ECG", category: "Lipid & Heart", price: 200 },
  // Thyroid
  {
    name: "TSH (Thyroid Stimulating Hormone)",
    category: "Thyroid",
    price: 280,
  },
  { name: "T3 (Triiodothyronine)", category: "Thyroid", price: 200 },
  { name: "T4 (Thyroxine)", category: "Thyroid", price: 200 },
  { name: "Thyroid Profile (T3, T4, TSH)", category: "Thyroid", price: 499 },
  // Urine & Stool
  { name: "Urine Routine & Microscopy", category: "Urine & Stool", price: 80 },
  {
    name: "Urine Culture & Sensitivity",
    category: "Urine & Stool",
    price: 350,
  },
  { name: "Stool Routine", category: "Urine & Stool", price: 80 },
  // Imaging
  { name: "X-Ray Chest (PA View)", category: "Radiology", price: 200 },
  { name: "X-Ray Any Part", category: "Radiology", price: 150 },
  { name: "Ultrasound Whole Abdomen", category: "Radiology", price: 600 },
  { name: "Ultrasound Lower Abdomen", category: "Radiology", price: 400 },
  { name: "Ultrasound Upper Abdomen", category: "Radiology", price: 400 },
  // Infection & Serology
  { name: "Widal Test", category: "Infection & Serology", price: 120 },
  { name: "Dengue NS1 Antigen", category: "Infection & Serology", price: 450 },
  { name: "Dengue IgM / IgG", category: "Infection & Serology", price: 450 },
  {
    name: "Malaria Antigen (Rapid)",
    category: "Infection & Serology",
    price: 180,
  },
  { name: "HBsAg (Hepatitis B)", category: "Infection & Serology", price: 200 },
  {
    name: "Anti-HCV (Hepatitis C)",
    category: "Infection & Serology",
    price: 300,
  },
  { name: "HIV I & II", category: "Infection & Serology", price: 250 },
  {
    name: "CRP (C-Reactive Protein)",
    category: "Infection & Serology",
    price: 200,
  },
  {
    name: "RA Factor (Rheumatoid)",
    category: "Infection & Serology",
    price: 180,
  },
  // Vitamins & Hormones
  { name: "Vitamin D (25-OH)", category: "Vitamins & Hormones", price: 700 },
  { name: "Vitamin B12", category: "Vitamins & Hormones", price: 600 },
  { name: "Iron (Serum)", category: "Vitamins & Hormones", price: 200 },
  { name: "Calcium (Serum)", category: "Vitamins & Hormones", price: 120 },
  { name: "PSA (Prostate)", category: "Vitamins & Hormones", price: 500 },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Blood Test": "bg-red-50 text-red-700 border-red-200",
  "Liver & Kidney": "bg-amber-50 text-amber-700 border-amber-200",
  "Lipid & Heart": "bg-pink-50 text-pink-700 border-pink-200",
  Thyroid: "bg-purple-50 text-purple-700 border-purple-200",
  "Urine & Stool": "bg-green-50 text-green-700 border-green-200",
  Radiology: "bg-blue-50 text-blue-700 border-blue-200",
  "Infection & Serology": "bg-orange-50 text-orange-700 border-orange-200",
  "Vitamins & Hormones": "bg-teal-50 text-teal-700 border-teal-200",
};

function TestSearchTab() {
  const [query, setQuery] = useState("");

  const filtered =
    query.trim().length > 0
      ? TEST_CATALOGUE.filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.category.toLowerCase().includes(query.toLowerCase()),
        )
      : TEST_CATALOGUE;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search test name or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          data-ocid="test_search.input"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-kdc-navy">{filtered.length}</span>{" "}
        tests
        {query.trim().length > 0 && (
          <>
            {" "}
            for &ldquo;<span className="text-kdc-blue">{query}</span>&rdquo;
          </>
        )}
      </p>

      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
            data-ocid="test_search.empty_state"
          >
            <div className="w-14 h-14 rounded-full bg-kdc-blue/10 flex items-center justify-center mx-auto mb-4">
              <FlaskConical className="w-7 h-7 text-kdc-blue/50" />
            </div>
            <p className="font-semibold text-kdc-navy">No tests found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different test name or category.
            </p>
          </motion.div>
        ) : (
          filtered.map((test, idx) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="flex items-center justify-between gap-3 bg-white rounded-lg border border-kdc-blue/10 px-4 py-3 hover:border-kdc-blue/30 transition-colors"
              data-ocid={`test_search.item.${idx + 1}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-kdc-teal/10 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-4 h-4 text-kdc-teal" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-kdc-navy leading-tight truncate">
                    {test.name}
                  </p>
                  <span
                    className={`inline-block text-xs border rounded-full px-2 py-0.5 mt-0.5 font-medium ${
                      CATEGORY_COLORS[test.category] ??
                      "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {test.category}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-base font-bold text-kdc-blue">
                  ₹{test.price}
                </p>
                <a
                  href="#appointment"
                  className="text-xs text-kdc-teal hover:underline font-medium"
                  data-ocid={`test_search.book.${idx + 1}`}
                >
                  Book Now
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-1">
        * Prices are indicative. Final charges may vary. Contact us for
        clarification.
      </p>
    </div>
  );
}

function WhatsAppButtons({
  details,
  ocidPrefix,
}: {
  details: {
    bookingId: string;
    patientName: string;
    serviceType: string;
    preferredDate: string;
    phone: string;
  };
  ocidPrefix: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {WHATSAPP_NUMBERS.map((wa, i) => (
        <a
          key={wa.number}
          href={buildWhatsAppUrl(wa.number, details)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#25D366" }}
          data-ocid={`${ocidPrefix}.primary_button.${i + 1}`}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp: {wa.label}
        </a>
      ))}
    </div>
  );
}

function AppointmentCard({ item }: { item: AppointmentWithId }) {
  const bookingDate = new Date(
    Number(item.appointment.bookingTime) / 1_000_000,
  );
  const details = {
    bookingId: item.id.toString(),
    patientName: item.appointment.patientName,
    serviceType: item.appointment.serviceType,
    preferredDate: item.appointment.preferredDate,
    phone: item.appointment.phone,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-kdc-blue/15 p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-kdc-teal/10 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-kdc-teal" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Booking ID</p>
            <p className="font-bold text-kdc-blue text-sm">
              #{item.id.toString()}
            </p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground bg-kdc-light rounded-full px-3 py-1">
          {bookingDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-kdc-navy/50" />
          <div>
            <p className="text-xs text-muted-foreground">Patient</p>
            <p className="text-sm font-semibold text-kdc-navy">
              {item.appointment.patientName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 text-kdc-navy/50" />
          <div>
            <p className="text-xs text-muted-foreground">Preferred Date</p>
            <p className="text-sm font-semibold text-kdc-navy">
              {item.appointment.preferredDate}
            </p>
          </div>
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <ClipboardList className="w-3.5 h-3.5 text-kdc-navy/50" />
          <div>
            <p className="text-xs text-muted-foreground">Service</p>
            <p className="text-sm font-semibold text-kdc-navy">
              {item.appointment.serviceType}
            </p>
          </div>
        </div>
        {item.appointment.message && (
          <div className="sm:col-span-2 bg-kdc-light rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Message</p>
            <p className="text-sm text-kdc-navy">{item.appointment.message}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-kdc-blue/10">
        <WhatsAppButtons details={details} ocidPrefix="history" />
      </div>
    </motion.div>
  );
}

function MyAppointmentsTab() {
  const [searchPhone, setSearchPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");

  const { data: appointments, isFetching } =
    useGetAppointmentsByPhone(submittedPhone);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    setSubmittedPhone(searchPhone);
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSearch}
        className="flex gap-3"
        data-ocid="history.modal"
      >
        <div className="flex-1">
          <Label htmlFor="historyPhone" className="sr-only">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="historyPhone"
              placeholder="Enter your phone number"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="pl-10"
              data-ocid="history.search_input"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isFetching}
          className="bg-kdc-blue hover:bg-kdc-navy text-white"
          data-ocid="history.primary_button"
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="ml-2">{isFetching ? "Searching..." : "Search"}</span>
        </Button>
      </form>

      {submittedPhone &&
        !isFetching &&
        (appointments && appointments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              Found{" "}
              <span className="font-semibold text-kdc-navy">
                {appointments.length}
              </span>{" "}
              appointment{appointments.length !== 1 ? "s" : ""}
            </p>
            {appointments.map((item, i) => (
              <div key={item.id.toString()} data-ocid={`history.item.${i + 1}`}>
                <AppointmentCard item={item} />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
            data-ocid="history.empty_state"
          >
            <div className="w-14 h-14 rounded-full bg-kdc-blue/10 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-7 h-7 text-kdc-blue/50" />
            </div>
            <p className="font-semibold text-kdc-navy">No appointments found</p>
            <p className="text-sm text-muted-foreground mt-1">
              No bookings found for this phone number.
            </p>
          </motion.div>
        ))}
    </div>
  );
}

type FormState = {
  patientName: string;
  phone: string;
  email: string;
  serviceType: string;
  preferredDate: string;
  message: string;
};

const emptyForm: FormState = {
  patientName: "",
  phone: "",
  email: "",
  serviceType: "",
  preferredDate: "",
  message: "",
};

export default function BookAppointmentSection() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<FormState | null>(
    null,
  );

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
    const snapshot = { ...form };
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
          setConfirmedBooking(snapshot);
          setForm(emptyForm);
        },
        onError: () => {
          toast.error("Failed to book appointment. Please try again.");
        },
      },
    );
  }

  const confirmedDetails =
    bookingId && confirmedBooking
      ? {
          bookingId,
          patientName: confirmedBooking.patientName,
          serviceType: confirmedBooking.serviceType,
          preferredDate: confirmedBooking.preferredDate,
          phone: confirmedBooking.phone,
        }
      : null;

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
            Appointments
          </h2>
          <div className="w-16 h-1 bg-kdc-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="book" className="w-full">
            <TabsList
              className="grid w-full grid-cols-3 mb-8"
              data-ocid="appointment.tab"
            >
              <TabsTrigger value="book" data-ocid="appointment.tab">
                Book Appointment
              </TabsTrigger>
              <TabsTrigger value="tests" data-ocid="appointment.tab">
                Test Prices
              </TabsTrigger>
              <TabsTrigger value="history" data-ocid="appointment.tab">
                My Appointments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="book">
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
                    <span className="font-bold text-kdc-blue">
                      #{bookingId}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <Button
                      onClick={() => {
                        setBookingId(null);
                        setConfirmedBooking(null);
                      }}
                      className="bg-kdc-blue hover:bg-kdc-navy text-white"
                      data-ocid="appointment.secondary_button"
                    >
                      Book Another Appointment
                    </Button>
                    {confirmedDetails && (
                      <WhatsAppButtons
                        details={confirmedDetails}
                        ocidPrefix="appointment"
                      />
                    )}
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
            </TabsContent>

            <TabsContent value="tests">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-kdc-navy">
                    Test Prices
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Search any individual test and view its price instantly.
                  </p>
                </div>
                <TestSearchTab />
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <MyAppointmentsTab />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
