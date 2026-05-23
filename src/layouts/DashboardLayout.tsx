import { Outlet } from 'react-router-dom'
import DashboardSidebar from '@/src/components/layout/DashboardSidebar'
import { NotificationCenter } from '@/src/components/ui/NotificationCenter'
import { BadgeUnlock } from '@/src/components/ui/BadgeUnlock'
import { useGamification } from '@/src/context/GamificationContext'
import { useAuth } from '@/src/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function DashboardLayoutInner() {
  const { pendingBadge, dismissBadge } = useGamification()
  const { needsOnboarding } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (needsOnboarding) navigate('/onboarding')
  }, [needsOnboarding, navigate])

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-16 lg:pt-0" id="main-content">
        {/* Top bar with notifications (desktop) */}
        <div className="hidden lg:flex items-center justify-end px-8 py-3 border-b border-border">
          <NotificationCenter />
        </div>
        <div className="min-h-screen p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
      <BadgeUnlock badge={pendingBadge} onDismiss={dismissBadge} />
    </div>
  )
}

export default function DashboardLayout() {
  return <DashboardLayoutInner />
}
