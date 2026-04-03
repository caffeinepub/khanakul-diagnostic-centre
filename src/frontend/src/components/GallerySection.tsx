import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const galleryItems = [
  {
    src: "/assets/generated/gallery-reception.dim_800x600.jpg",
    label: "Reception",
  },
  {
    src: "/assets/generated/gallery-lab.dim_800x600.jpg",
    label: "Pathology Lab",
  },
  {
    src: "/assets/generated/gallery-ultrasound.dim_800x600.jpg",
    label: "Ultrasound Room",
  },
  {
    src: "/assets/generated/gallery-exterior.dim_800x600.jpg",
    label: "Our Building",
  },
  {
    src: "/assets/generated/gallery-radiology.dim_800x600.jpg",
    label: "Radiology & ECG",
  },
  {
    src: "/assets/generated/gallery-consultation.dim_800x600.jpg",
    label: "Consultation Room",
  },
];

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const goPrev = () => {
    if (activeIndex === null) return;
    setActiveIndex(
      (activeIndex - 1 + galleryItems.length) % galleryItems.length,
    );
  };

  const goNext = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % galleryItems.length);
  };

  const activeItem = activeIndex !== null ? galleryItems[activeIndex] : null;

  return (
    <section id="gallery" className="py-20 bg-kdc-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-kdc-teal text-sm font-semibold uppercase tracking-widest">
            Virtual Tour
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-kdc-navy mt-2">
            Our Facility
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Take a tour of our modern diagnostic centre
          </p>
          <div className="w-16 h-1 bg-kdc-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl shadow-md cursor-pointer"
              onClick={() => openLightbox(index)}
              data-ocid={`gallery.item.${index + 1}`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-kdc-navy/80 to-transparent px-4 py-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-semibold text-sm">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => !open && closeLightbox()}
      >
        <DialogContent
          className="max-w-3xl w-full p-0 overflow-hidden bg-kdc-navy border-none"
          data-ocid="gallery.dialog"
        >
          <DialogTitle className="sr-only">
            {activeItem?.label ?? "Gallery Image"}
          </DialogTitle>
          <div className="relative">
            <AnimatePresence mode="wait">
              {activeItem && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <img
                    src={activeItem.src}
                    alt={activeItem.label}
                    className="w-full max-h-[70vh] object-contain bg-kdc-navy"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close lightbox"
              data-ocid="gallery.close_button"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev button */}
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous image"
              data-ocid="gallery.pagination_prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={goNext}
              className="absolute right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next image"
              data-ocid="gallery.pagination_next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Caption */}
          {activeItem && (
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-white font-semibold">{activeItem.label}</p>
              <p className="text-white/60 text-sm">
                {activeIndex !== null ? activeIndex + 1 : 0} /{" "}
                {galleryItems.length}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
