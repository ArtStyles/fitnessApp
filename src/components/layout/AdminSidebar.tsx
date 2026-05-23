import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Users,
  ArrowLeft,
  Menu,
  X,
  BookOpen,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/workouts', label: 'Entrenamientos', icon: Dumbbell },
  { href: '/admin/training-plans', label: 'Programas', icon: BookOpen },
  { href: '/admin/nutrition', label: 'Nutrición', icon: Utensils },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
]

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </Link>
      </div>

      {/* Back to App */}
      <div className="p-4">
        <Button variant="outline" asChild className="w-full justify-start">
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la App
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {adminLinks.map((link) => {
          const isActive = location.pathname === link.href
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-accent text-accent-foreground">
              {user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-accent">Administrador</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full mt-4 text-destructive hover:text-destructive"
        >
          Cerrar Sesión
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-strong z-40 flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-lg">Admin</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2"
          aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          className="lg:hidden fixed inset-0 z-50 bg-background"
        >
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-card border-r border-border z-40">
        <SidebarContent />
      </aside>
    </>
  )
}
