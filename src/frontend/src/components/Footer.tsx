import {
  Cross,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Health Packages", href: "#packages" },
  { label: "Book Appointment", href: "#appointment" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
  { label: "Support", href: "#support" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-kdc-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-kdc-blue flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">KDC</div>
                <div className="text-xs text-white/60">
                  Khanakul Diagnostic Centre
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Providing accurate diagnostics and compassionate care to the
              people of Khanakul and surrounding areas since 2005.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-kdc-teal flex-shrink-0" />
                Ramnagar, Khanakul, Hooghly - 712406
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-kdc-teal flex-shrink-0" />
                9732411070 / 6294215788
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-kdc-teal flex-shrink-0" />
                <a
                  href="mailto:khanakuldiagnosticcentre25@gmail.com"
                  className="hover:text-kdc-teal transition-colors"
                >
                  khanakuldiagnosticcentre25@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-5">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 text-sm hover:text-kdc-teal transition-colors"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-base mb-5">Social Media</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-kdc-blue flex items-center justify-center transition-colors"
                aria-label="Facebook"
                data-ocid="footer.link"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-kdc-blue flex items-center justify-center transition-colors"
                aria-label="Instagram"
                data-ocid="footer.link"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-kdc-blue flex items-center justify-center transition-colors"
                aria-label="YouTube"
                data-ocid="footer.link"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="text-white/60 text-sm">
              <p className="font-semibold text-white mb-1">Emergency Contact</p>
              <p>9732411070 / 6294215788</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/50 text-xs">
            © {year} Khanakul Diagnostic Centre. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-kdc-teal transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
