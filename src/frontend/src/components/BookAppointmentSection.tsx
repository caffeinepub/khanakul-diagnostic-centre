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
  Lock,
  MessageCircle,
  Phone,
  Search,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Appointment, AppointmentWithId } from "../backend.d";
import {
  useBookAppointment,
  useDeleteAppointment,
  useGetAllAppointmentsByPassword,
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
  { name: "Complete Blood Count (CBC)", category: "Blood Test", price: 300 },
  { name: "CBC with ESR", category: "Blood Test", price: 300 },
  { name: "Blood Sugar Fasting (BSF)", category: "Blood Test", price: 60 },
  { name: "Blood Sugar PP", category: "Blood Test", price: 60 },
  { name: "Random Blood Sugar", category: "Blood Test", price: 60 },
  { name: "HbA1c (Glycated Haemoglobin)", category: "Blood Test", price: 350 },
  { name: "Haemoglobin (Hb)", category: "Blood Test", price: 50 },
  { name: "Haemoglobin", category: "Blood Test", price: 50 },
  {
    name: "ESR (Erythrocyte Sedimentation Rate)",
    category: "Blood Test",
    price: 50,
  },
  { name: "Blood Group & Rh Factor", category: "Blood Test", price: 50 },
  {
    name: "Bleeding Time & Clotting Time (BT & CT)",
    category: "Blood Test",
    price: 100,
  },
  {
    name: "Absolute Eosinophil Count (AEC)",
    category: "Blood Test",
    price: 100,
  },
  { name: "APTT / PTT", category: "Blood Test", price: 500 },
  { name: "DC (Differential Count)", category: "Blood Test", price: 50 },
  { name: "DC with MP", category: "Blood Test", price: 170 },
  { name: "Fibrinogen", category: "Blood Test", price: 800 },
  {
    name: "FDP (Fibrin Degradation Products)",
    category: "Blood Test",
    price: 1000,
  },
  { name: "G6PD Quantitative", category: "Blood Test", price: 800 },
  { name: "GTT (Glucose Tolerance Test)", category: "Blood Test", price: 150 },
  { name: "HPLC", category: "Blood Test", price: 800 },
  { name: "Lactate", category: "Blood Test", price: 1000 },
  { name: "PT with INR", category: "Blood Test", price: 400 },
  { name: "Potassium", category: "Blood Test", price: 200 },
  { name: "PCV (Packed Cell Volume)", category: "Blood Test", price: 50 },
  { name: "Platelet Count", category: "Blood Test", price: 50 },
  { name: "PCV, Platelet Count", category: "Blood Test", price: 100 },
  { name: "Reticulocyte Count", category: "Blood Test", price: 200 },
  { name: "RBS (Random Blood Sugar)", category: "Blood Test", price: 50 },
  { name: "Sodium (Na+)", category: "Blood Test", price: 200 },
  {
    name: "Sugar (Fasting/PP/Random)(Each)",
    category: "Blood Test",
    price: 50,
  },
  { name: "TC / DC", category: "Blood Test", price: 50 },
  { name: "TC, DC, HB%", category: "Blood Test", price: 100 },
  { name: "TC, DC, HB%, ESR", category: "Blood Test", price: 120 },
  { name: "TC, DC, MP, ESR", category: "Blood Test", price: 220 },
  { name: "TC, DC, HB%, ESR, MP", category: "Blood Test", price: 270 },
  { name: "TC, DC, HB%, MP", category: "Blood Test", price: 220 },
  { name: "TC, DC, MP", category: "Blood Test", price: 220 },
  { name: "TC, DC, Platelet", category: "Blood Test", price: 150 },
  { name: "Thrombin Time", category: "Blood Test", price: 800 },
  { name: "Semen Analysis", category: "Blood Test", price: 300 },
  // Liver & Kidney
  { name: "Liver Function Test (LFT)", category: "Liver & Kidney", price: 500 },
  {
    name: "Kidney Function Test (KFT)",
    category: "Liver & Kidney",
    price: 1500,
  },
  { name: "Serum Creatinine", category: "Liver & Kidney", price: 150 },
  { name: "Serum Uric Acid", category: "Liver & Kidney", price: 120 },
  { name: "Blood Urea", category: "Liver & Kidney", price: 100 },
  { name: "BUN (Blood Urea Nitrogen)", category: "Liver & Kidney", price: 200 },
  { name: "BUN Creatinine Ratio", category: "Liver & Kidney", price: 300 },
  { name: "SGOT (AST)", category: "Liver & Kidney", price: 150 },
  { name: "SGPT (ALT)", category: "Liver & Kidney", price: 150 },
  {
    name: "Bilirubin (Total + Direct)",
    category: "Liver & Kidney",
    price: 150,
  },
  { name: "Albumin", category: "Liver & Kidney", price: 100 },
  {
    name: "ALP (Alkaline Phosphatase)",
    category: "Liver & Kidney",
    price: 150,
  },
  { name: "ADA (Adenosine Deaminase)", category: "Liver & Kidney", price: 700 },
  { name: "Amylase", category: "Liver & Kidney", price: 450 },
  { name: "Acid Phosphatase", category: "Liver & Kidney", price: 350 },
  { name: "Bile Acid", category: "Liver & Kidney", price: 1500 },
  {
    name: "ACR (Albumin Creatinine Ratio) Urine",
    category: "Liver & Kidney",
    price: 500,
  },
  { name: "Bicarbonate (HCO3)", category: "Liver & Kidney", price: 600 },
  { name: "Chloride", category: "Liver & Kidney", price: 200 },
  {
    name: "Electrolytes (Na+, K+, Cl-, HCO3)",
    category: "Liver & Kidney",
    price: 300,
  },
  { name: "eGFR (Estimated GFR)", category: "Liver & Kidney", price: 600 },
  { name: "GGT (Gamma GT)", category: "Liver & Kidney", price: 200 },
  { name: "Globulin", category: "Liver & Kidney", price: 250 },
  { name: "Lipase", category: "Liver & Kidney", price: 450 },
  { name: "LFT (Liver Function Test)", category: "Liver & Kidney", price: 500 },
  {
    name: "KFT (Kidney Function Test)",
    category: "Liver & Kidney",
    price: 1500,
  },
  { name: "Protein Electrophoresis", category: "Liver & Kidney", price: 1200 },
  { name: "Uric Acid", category: "Liver & Kidney", price: 150 },
  { name: "Urea", category: "Liver & Kidney", price: 150 },
  {
    name: "TIBC (Total Iron Binding Capacity)",
    category: "Liver & Kidney",
    price: 1500,
  },
  // Lipid & Heart
  { name: "Lipid Profile", category: "Lipid & Heart", price: 500 },
  { name: "Lipid Profile (LP)", category: "Lipid & Heart", price: 500 },
  { name: "Cholesterol (Total)", category: "Lipid & Heart", price: 150 },
  { name: "Triglycerides", category: "Lipid & Heart", price: 120 },
  { name: "Triglyceride (TG)", category: "Lipid & Heart", price: 150 },
  { name: "HDL Cholesterol", category: "Lipid & Heart", price: 150 },
  { name: "LDL Cholesterol", category: "Lipid & Heart", price: 150 },
  {
    name: "CPK (Creatine Phosphokinase)",
    category: "Lipid & Heart",
    price: 350,
  },
  { name: "CPK MB", category: "Lipid & Heart", price: 450 },
  { name: "ECG", category: "Lipid & Heart", price: 200 },
  { name: "Lipoprotein", category: "Lipid & Heart", price: 600 },
  { name: "VLDL", category: "Lipid & Heart", price: 150 },
  // Thyroid & Hormones
  {
    name: "TSH (Thyroid Stimulating Hormone)",
    category: "Thyroid & Hormones",
    price: 280,
  },
  { name: "T3 (Triiodothyronine)", category: "Thyroid & Hormones", price: 200 },
  { name: "T4 (Thyroxine)", category: "Thyroid & Hormones", price: 200 },
  {
    name: "Thyroid Profile (T3, T4, TSH)",
    category: "Thyroid & Hormones",
    price: 499,
  },
  {
    name: "Anti-TPO (Anti Thyroid Peroxidase)",
    category: "Thyroid & Hormones",
    price: 1300,
  },
  {
    name: "Anti-TG (Anti Thyroglobulin)",
    category: "Thyroid & Hormones",
    price: 1200,
  },
  {
    name: "ACTH (Adrenocorticotropic Hormone)",
    category: "Thyroid & Hormones",
    price: 700,
  },
  {
    name: "AMH (Anti Mullerian Hormone)",
    category: "Thyroid & Hormones",
    price: 1900,
  },
  { name: "Beta HCG", category: "Thyroid & Hormones", price: 600 },
  { name: "Cortisol", category: "Thyroid & Hormones", price: 1000 },
  { name: "Cortisol Morning", category: "Thyroid & Hormones", price: 1000 },
  { name: "Cortisol Evening", category: "Thyroid & Hormones", price: 1000 },
  { name: "C-Peptide Fasting", category: "Thyroid & Hormones", price: 3000 },
  { name: "C-Peptide PP", category: "Thyroid & Hormones", price: 2000 },
  { name: "DHEAS", category: "Thyroid & Hormones", price: 1000 },
  {
    name: "FSH (Follicle Stimulating Hormone)",
    category: "Thyroid & Hormones",
    price: 450,
  },
  { name: "Growth Hormone", category: "Thyroid & Hormones", price: 900 },
  {
    name: "LH (Luteinizing Hormone)",
    category: "Thyroid & Hormones",
    price: 450,
  },
  { name: "LH + FSH", category: "Thyroid & Hormones", price: 900 },
  { name: "LH + FSH + Prolactin", category: "Thyroid & Hormones", price: 1350 },
  {
    name: "PSA (Prostate Specific Antigen)",
    category: "Thyroid & Hormones",
    price: 550,
  },
  { name: "Prolactin", category: "Thyroid & Hormones", price: 450 },
  { name: "TSH", category: "Thyroid & Hormones", price: 300 },
  { name: "T3, TSH or T4, TSH", category: "Thyroid & Hormones", price: 550 },
  { name: "FT3, FT4, TSH", category: "Thyroid & Hormones", price: 900 },
  { name: "FT3, TSH or FT4, TSH", category: "Thyroid & Hormones", price: 700 },
  { name: "Testosterone", category: "Thyroid & Hormones", price: 750 },
  {
    name: "PTH (Parathyroid Hormone)",
    category: "Thyroid & Hormones",
    price: 1800,
  },
  {
    name: "Quadruple Marker (2nd Trimester)",
    category: "Thyroid & Hormones",
    price: 2500,
  },
  // Urine & Stool
  { name: "Urine Routine & Microscopy", category: "Urine & Stool", price: 80 },
  {
    name: "Urine Culture & Sensitivity",
    category: "Urine & Stool",
    price: 350,
  },
  { name: "Stool Routine", category: "Urine & Stool", price: 80 },
  { name: "Osmolality Urine", category: "Urine & Stool", price: 400 },
  { name: "Urine OBT", category: "Urine & Stool", price: 100 },
  { name: "Urine RE + CS", category: "Urine & Stool", price: 350 },
  { name: "Urine for Ketone Body", category: "Urine & Stool", price: 200 },
  { name: "Stool RE", category: "Urine & Stool", price: 100 },
  { name: "Stool OBT", category: "Urine & Stool", price: 150 },
  { name: "Stool RE + OBT", category: "Urine & Stool", price: 250 },
  { name: "Stool OPC", category: "Urine & Stool", price: 150 },
  { name: "Urine RE", category: "Urine & Stool", price: 50 },
  // Vitamins & Minerals
  { name: "Calcium (Serum)", category: "Vitamins & Minerals", price: 250 },
  {
    name: "Calcium Creatinine Ratio",
    category: "Vitamins & Minerals",
    price: 400,
  },
  { name: "Vitamin D (25-OH)", category: "Vitamins & Minerals", price: 700 },
  { name: "Vitamin B12", category: "Vitamins & Minerals", price: 600 },
  { name: "Iron (Serum)", category: "Vitamins & Minerals", price: 200 },
  { name: "PSA (Prostate)", category: "Vitamins & Minerals", price: 500 },
  { name: "Ferritin", category: "Vitamins & Minerals", price: 750 },
  { name: "Folic Acid", category: "Vitamins & Minerals", price: 900 },
  { name: "Copper (Serum)", category: "Vitamins & Minerals", price: 1200 },
  { name: "Ceruloplasmin", category: "Vitamins & Minerals", price: 1200 },
  { name: "Vitamin A", category: "Vitamins & Minerals", price: 3200 },
  { name: "Vitamin B12", category: "Vitamins & Minerals", price: 1200 },
  { name: "Vitamin D (25 OH)", category: "Vitamins & Minerals", price: 1200 },
  { name: "Vitamin D3 (125 OH)", category: "Vitamins & Minerals", price: 3200 },
  {
    name: "Vitamin E (Tocopherol)",
    category: "Vitamins & Minerals",
    price: 2500,
  },
  { name: "Thyroglobulin", category: "Vitamins & Minerals", price: 4500 },
  // Radiology
  { name: "X-Ray Chest (PA View)", category: "Radiology", price: 200 },
  { name: "X-Ray Any Part", category: "Radiology", price: 150 },
  { name: "Ultrasound Whole Abdomen", category: "Radiology", price: 600 },
  { name: "Ultrasound Lower Abdomen", category: "Radiology", price: 400 },
  { name: "Ultrasound Upper Abdomen", category: "Radiology", price: 400 },
  // Infection & Serology
  { name: "Widal Test", category: "Infection & Serology", price: 120 },
  { name: "Dengue NS1 Antigen", category: "Infection & Serology", price: 1000 },
  { name: "Dengue NS1", category: "Infection & Serology", price: 1000 },
  { name: "Dengue IgM / IgG", category: "Infection & Serology", price: 450 },
  {
    name: "Dengue by ELISA (IgG+IgM)",
    category: "Infection & Serology",
    price: 1000,
  },
  {
    name: "Dengue by ELISA (IgG/IgM)(Each)",
    category: "Infection & Serology",
    price: 1500,
  },
  {
    name: "Malaria Antigen (Rapid)",
    category: "Infection & Serology",
    price: 180,
  },
  {
    name: "MP (Malaria Parasite)",
    category: "Infection & Serology",
    price: 120,
  },
  { name: "HBsAg (Hepatitis B)", category: "Infection & Serology", price: 250 },
  {
    name: "HBsAg (Hepatitis B Surface Antigen)",
    category: "Infection & Serology",
    price: 250,
  },
  {
    name: "Anti-HCV (Hepatitis C)",
    category: "Infection & Serology",
    price: 500,
  },
  { name: "HIV I & II", category: "Infection & Serology", price: 500 },
  { name: "HIV 1 & 2", category: "Infection & Serology", price: 500 },
  {
    name: "CRP (C-Reactive Protein)",
    category: "Infection & Serology",
    price: 300,
  },
  {
    name: "RA Factor (Rheumatoid)",
    category: "Infection & Serology",
    price: 180,
  },
  { name: "AFB by ZN Stain", category: "Infection & Serology", price: 200 },
  {
    name: "ASO Titre (Anti Streptolysin O)",
    category: "Infection & Serology",
    price: 300,
  },
  { name: "Blood Culture", category: "Infection & Serology", price: 1200 },
  {
    name: "BACTEC Blood Culture",
    category: "Infection & Serology",
    price: 1000,
  },
  {
    name: "Covid-19 IgG Antibody",
    category: "Infection & Serology",
    price: 1000,
  },
  { name: "Covid-19 RT-PCR", category: "Infection & Serology", price: 1000 },
  { name: "Chikungunya IgG", category: "Infection & Serology", price: 750 },
  { name: "Chikungunya IgM", category: "Infection & Serology", price: 750 },
  {
    name: "Culture Vaginal Swab",
    category: "Infection & Serology",
    price: 600,
  },
  { name: "Culture Swab", category: "Infection & Serology", price: 1100 },
  { name: "Culture Stool", category: "Infection & Serology", price: 300 },
  { name: "Culture Semen", category: "Infection & Serology", price: 1100 },
  { name: "Culture Pus", category: "Infection & Serology", price: 600 },
  { name: "Culture Sputum", category: "Infection & Serology", price: 500 },
  { name: "Culture Urine", category: "Infection & Serology", price: 300 },
  { name: "HAV IgG/IgM", category: "Infection & Serology", price: 1500 },
  { name: "HEV IgG/IgM", category: "Infection & Serology", price: 1500 },
  { name: "HBV DNA", category: "Infection & Serology", price: 8000 },
  {
    name: "Mantoux Test (PPD 5TU & 10TU)",
    category: "Infection & Serology",
    price: 150,
  },
  {
    name: "MPDA (Malaria Parasite Dual Antigen)",
    category: "Infection & Serology",
    price: 350,
  },
  {
    name: "PBS (Peripheral Blood Smear)",
    category: "Infection & Serology",
    price: 100,
  },
  { name: "Widal Test", category: "Infection & Serology", price: 150 },
  { name: "VDRL", category: "Infection & Serology", price: 150 },
  { name: "RA Factor", category: "Infection & Serology", price: 300 },
  {
    name: "Rubella IgG/IgM (Each)",
    category: "Infection & Serology",
    price: 1450,
  },
  { name: "TORCH Profile", category: "Infection & Serology", price: 2500 },
  { name: "Sputum for AFB", category: "Infection & Serology", price: 150 },
  // Immunology & Autoimmune
  {
    name: "AFP (Alpha Feto Protein)",
    category: "Immunology & Autoimmune",
    price: 700,
  },
  { name: "ANA Profile", category: "Immunology & Autoimmune", price: 500 },
  { name: "ANA HEP-2", category: "Immunology & Autoimmune", price: 1200 },
  {
    name: "Anti-CCP (CCP Antibody)",
    category: "Immunology & Autoimmune",
    price: 1500,
  },
  { name: "Allergy Profile", category: "Immunology & Autoimmune", price: 2500 },
  {
    name: "Beta-2 Glycoprotein IgG",
    category: "Immunology & Autoimmune",
    price: 1000,
  },
  {
    name: "Beta-2 Glycoprotein IgM",
    category: "Immunology & Autoimmune",
    price: 1000,
  },
  {
    name: "Beta-2 Glycoprotein IgA",
    category: "Immunology & Autoimmune",
    price: 1000,
  },
  {
    name: "CEA (Carcinoembryonic Antigen)",
    category: "Immunology & Autoimmune",
    price: 1350,
  },
  { name: "CA-125", category: "Immunology & Autoimmune", price: 1200 },
  { name: "CA 19-9", category: "Immunology & Autoimmune", price: 1200 },
  { name: "CA 15-3", category: "Immunology & Autoimmune", price: 2000 },
  { name: "CA 72-4", category: "Immunology & Autoimmune", price: 1600 },
  {
    name: "Cardiolipin Antibody IgG/IgM/IgA",
    category: "Immunology & Autoimmune",
    price: 3000,
  },
  { name: "CD3+CD4+CD8", category: "Immunology & Autoimmune", price: 1800 },
  {
    name: "ENA Profile (Extractable Nuclear Antigen)",
    category: "Immunology & Autoimmune",
    price: 4000,
  },
  {
    name: "IgE (Immunoglobulin E)",
    category: "Immunology & Autoimmune",
    price: 600,
  },
  // Genetics & Biopsy
  { name: "Beta Thalassemia", category: "Genetics & Biopsy", price: 7000 },
  { name: "Biopsy Small", category: "Genetics & Biopsy", price: 700 },
  { name: "Biopsy Medium", category: "Genetics & Biopsy", price: 1000 },
  { name: "Biopsy Large", category: "Genetics & Biopsy", price: 1500 },
  {
    name: "Chromosome Analysis Single",
    category: "Genetics & Biopsy",
    price: 3200,
  },
  {
    name: "FNAC (From Superficial Organ)",
    category: "Genetics & Biopsy",
    price: 1500,
  },
  { name: "FNAC", category: "Genetics & Biopsy", price: 500 },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Blood Test": "bg-red-50 text-red-700 border-red-200",
  "Liver & Kidney": "bg-amber-50 text-amber-700 border-amber-200",
  "Lipid & Heart": "bg-pink-50 text-pink-700 border-pink-200",
  "Thyroid & Hormones": "bg-purple-50 text-purple-700 border-purple-200",
  Thyroid: "bg-purple-50 text-purple-700 border-purple-200",
  "Urine & Stool": "bg-green-50 text-green-700 border-green-200",
  Radiology: "bg-blue-50 text-blue-700 border-blue-200",
  "Infection & Serology": "bg-orange-50 text-orange-700 border-orange-200",
  "Vitamins & Minerals": "bg-teal-50 text-teal-700 border-teal-200",
  "Vitamins & Hormones": "bg-teal-50 text-teal-700 border-teal-200",
  "Immunology & Autoimmune": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Genetics & Biopsy": "bg-slate-50 text-slate-700 border-slate-200",
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
              key={`${test.name}-${idx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.01 }}
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

function AdminAppointmentsTab() {
  const [filterQuery, setFilterQuery] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [submittedPassword, setSubmittedPassword] = useState("");
  const { isPending: isDeleting } = useDeleteAppointment();

  const {
    data: appointments,
    isFetching,
    isError,
    isSuccess,
  } = useGetAllAppointmentsByPassword(
    submittedPassword,
    submittedPassword.length > 0,
  );

  // Show error toast when password is wrong
  useEffect(() => {
    if (isError && submittedPassword.length > 0) {
      setSubmittedPassword("");
      setAdminPassword("");
      toast.error("Incorrect password. Please try again.");
    }
  }, [isError, submittedPassword]);

  const filtered = (appointments ?? []).filter(
    (a: AppointmentWithId) =>
      a.appointment.patientName
        .toLowerCase()
        .includes(filterQuery.toLowerCase()) ||
      a.appointment.phone.includes(filterQuery),
  );

  if (!isSuccess) {
    return (
      <div
        className="flex items-center justify-center py-8"
        data-ocid="admin.panel"
      >
        <div className="w-full max-w-sm bg-white rounded-2xl border border-kdc-blue/20 shadow-md p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-kdc-blue/10 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-kdc-blue" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-kdc-navy">Admin Access</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the admin password to view all appointments.
            </p>
          </div>
          <div className="space-y-2 text-left">
            <Label
              htmlFor="admin-password"
              className="text-kdc-navy font-medium"
            >
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && adminPassword.length > 0) {
                  setSubmittedPassword(adminPassword);
                }
              }}
              className="border-kdc-blue/30 focus:border-kdc-blue"
              data-ocid="admin.input"
            />
          </div>
          <Button
            className="w-full bg-kdc-blue hover:bg-kdc-blue/90 text-white font-semibold"
            disabled={adminPassword.length === 0 || isFetching}
            onClick={() => {
              setSubmittedPassword(adminPassword);
            }}
            data-ocid="admin.primary_button"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Unlock
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="admin.panel">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-kdc-blue/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-kdc-blue" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-kdc-navy">
              All Appointments
            </h3>
            <p className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-kdc-navy">
                {appointments?.length ?? 0}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && (
            <Loader2
              className="w-5 h-5 animate-spin text-kdc-blue"
              data-ocid="admin.loading_state"
            />
          )}
          <Button
            size="sm"
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            onClick={() => {
              setSubmittedPassword("");
              setAdminPassword("");
              setFilterQuery("");
            }}
            data-ocid="admin.secondary_button"
          >
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            Lock
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter by name or phone..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="pl-10"
          data-ocid="admin.search_input"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12" data-ocid="admin.empty_state">
          <div className="w-14 h-14 rounded-full bg-kdc-blue/10 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-7 h-7 text-kdc-blue/50" />
          </div>
          <p className="font-semibold text-kdc-navy">No appointments found</p>
          {filterQuery && (
            <p className="text-sm text-muted-foreground mt-1">
              No results for &ldquo;{filterQuery}&rdquo;
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((item: AppointmentWithId, i: number) => {
            const appt = item.appointment;
            const bookingDate = new Date(Number(appt.bookingTime) / 1_000_000);
            return (
              <motion.div
                key={`${item.id.toString()}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="bg-white rounded-xl border border-kdc-blue/15 p-4 shadow-sm"
                data-ocid={`admin.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-kdc-teal/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-kdc-teal" />
                    </div>
                    <div>
                      <p className="font-semibold text-kdc-navy text-sm">
                        {appt.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appt.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-kdc-light rounded-full px-3 py-1">
                      {bookingDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                      onClick={() => {
                        toast.info(
                          "Delete requires appointment ID. Please use the backend console.",
                        );
                      }}
                      disabled={isDeleting}
                      title="Delete not available without appointment ID"
                      data-ocid={`admin.delete_button.${i + 1}`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-medium text-kdc-navy">
                      {appt.serviceType}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preferred Date</p>
                    <p className="font-medium text-kdc-navy">
                      {appt.preferredDate}
                    </p>
                  </div>
                  {appt.email && (
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium text-kdc-navy truncate">
                        {appt.email}
                      </p>
                    </div>
                  )}
                  {appt.message && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Message</p>
                      <p className="font-medium text-kdc-navy">
                        {appt.message}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
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
              className="grid w-full grid-cols-4 mb-8"
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
              <TabsTrigger value="admin" data-ocid="appointment.tab">
                Admin View
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

            <TabsContent value="admin">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <AdminAppointmentsTab />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
