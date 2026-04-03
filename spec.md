# Khanakul Diagnostic Centre

## Current State
The site has: HeroSection, ServicesSection, HealthPackagesSection, DoctorsSection, WhyChooseUsSection, BookAppointmentSection (with appointment booking, test prices, patient history, admin view), ContactSection (address/phone/email/map placeholder), and Footer.

Missing:
- Gallery section (nav link exists but no GallerySection component)
- Contact form (ContactSection only shows info, no form)
- Support/FAQ section

## Requested Changes (Diff)

### Add
- **GallerySection** (`src/frontend/src/components/GallerySection.tsx`): Photo gallery of the diagnostic centre -- lab equipment, reception, doctors, building exterior. Use a responsive grid/masonry layout with lightbox/modal on click. Use generated placeholder images since no user photos provided. Add `id="gallery"` for nav anchor.
- **SupportSection** (`src/frontend/src/components/SupportSection.tsx`): FAQ accordion with common diagnostic centre questions (appointment booking, test reports, home collection, report timing, payment, etc.) plus a WhatsApp quick support button linking to 919732411070.
- **ContactForm** inside the existing ContactSection: A simple enquiry form (Name, Phone, Message fields) with a submit button. On submit, show a success toast. No backend needed -- frontend-only with toast confirmation.

### Modify
- **App.tsx**: Import and add `<GallerySection />` (before ContactSection) and `<SupportSection />` (after ContactSection, before Footer).
- **Navbar.tsx**: Add "Support" nav link pointing to `#support`.
- **Footer.tsx**: Add "Gallery" and "Support" to quickLinks.
- **ContactSection.tsx**: Add a contact/enquiry form on the right side (replacing the plain map placeholder or adding below it). Keep the map link.

### Remove
- Nothing

## Implementation Plan
1. Generate 4-5 gallery images (lab, reception, exterior, equipment) using generate_image.
2. Create GallerySection with responsive grid, lightbox modal, `id="gallery"`.
3. Create SupportSection with FAQ accordion and WhatsApp support button, `id="support"`.
4. Update ContactSection to add a simple enquiry form below the map placeholder.
5. Update App.tsx, Navbar.tsx, Footer.tsx to wire everything together.
6. Validate and deploy.
