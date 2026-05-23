import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube, Facebook, Zap } from 'lucide-react'

const footerLinks = {
  producto: [
    { label: 'Características',   href: '/features' },
    { label: 'Planes de precio',  href: '/pricing' },
    { label: 'Entrenamientos',    href: '/register' },
    { label: 'Nutrición',         href: '/register' },
  ],
  empresa: [
    { label: 'Sobre Nosotros',    href: '/about' },
    { label: 'Nuestro equipo',    href: '/about' },
    { label: 'Blog',              href: '/about' },
    { label: 'Contacto',          href: '/about' },
  ],
  legal: [
    { label: 'Privacidad',        href: '/' },
    { label: 'Términos de uso',   href: '/' },
    { label: 'Cookies',           href: '/' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter,   href: 'https://twitter.com',   label: 'Twitter / X' },
  { icon: Youtube,   href: 'https://youtube.com',   label: 'YouTube' },
  { icon: Facebook,  href: 'https://facebook.com',  label: 'Facebook' },
]

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-primary-foreground font-bold text-lg leading-none">F</span>
              </div>
              <span className="font-bold text-xl tracking-tight">FitForge</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              Transforma tu cuerpo y tu vida con entrenamientos personalizados,
              planes de nutrición guiada y seguimiento de progreso en tiempo real.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Producto</h4>
            <ul className="space-y-3">
              {footerLinks.producto.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA mini */}
            <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Empieza hoy
              </p>
              <Link
                to="/register"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Crea tu cuenta gratis →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FitForge. Todos los derechos reservados.</p>
          <p>Hecho con dedicación para tu transformación 💪</p>
        </div>
      </div>
    </footer>
  )
}
