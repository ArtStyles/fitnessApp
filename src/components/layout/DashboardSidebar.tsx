import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Dumbbell,
  Utensils,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Layers,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sidebarLinks = [
  { href: '/dashboard',       label: 'Dashboard',      icon: Home },
  { href: '/workouts',        label: 'Entrenamientos', icon: Dumbbell },
  { href: '/exercises',       label: 'Ejercicios',     icon: Layers },
  { href: '/training-plans',  label: 'Programas',      icon: BookOpen },
  { href: '/nutrition',       label: 'Nutrición',      icon: Utensils },
  { href: '/progress',        label: 'Progreso',       icon: TrendingUp },
]

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar_collapsed', false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2" aria-label="Ir al dashboard">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-lg" aria-hidden="true">F</span>
          </div>
          {!isCollapsed && <span className="font-bold text-lg">FitForge</span>}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {isCollapsed
            ? <PanelLeftOpen className="w-5 h-5" aria-hidden="true" />
            : <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
          }
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2" aria-label="Navegación principal">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.href
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileOpen(false)}
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? link.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span className="font-medium">{link.label}</span>}
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="h-px bg-border my-4" />
            <Link
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              aria-current={location.pathname.startsWith('/admin') ? 'page' : undefined}
              title={isCollapsed ? 'Admin Panel' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span className="font-medium">Admin Panel</span>}
            </Link>
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground" aria-hidden="true">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.subscription}</p>
            </div>
          )}
        </div>
        <div className={`flex gap-2 mt-4 ${isCollapsed ? 'flex-col' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`flex-1 ${isCollapsed ? 'px-2' : ''}`}
          >
            <Link to="/profile" aria-label="Ver perfil">
              <User className="w-4 h-4" aria-hidden="true" />
              {!isCollapsed && <span className="ml-2">Perfil</span>}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            aria-label="Cerrar sesión"
            className={`flex-1 text-destructive hover:text-destructive ${isCollapsed ? 'px-2' : ''}`}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            {!isCollapsed && <span className="ml-2">Salir</span>}
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Saltar al contenido principal
      </a>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-strong z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2" aria-label="Ir al dashboard">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg" aria-hidden="true">F</span>
          </div>
          <span className="font-bold text-lg">FitForge</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2"
          aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-sidebar"
        >
          {isMobileOpen
            ? <X className="w-6 h-6" aria-hidden="true" />
            : <Menu className="w-6 h-6" aria-hidden="true" />
          }
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <motion.div
          id="mobile-sidebar"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
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
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 256 }}
        aria-label="Barra lateral"
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-card border-r border-border z-40"
      >
        <SidebarContent />
      </motion.aside>
    </>
  )
}
