import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Crown, Camera, Save, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/src/context/AuthContext'
import { useGamification, getLevelInfo } from '@/src/context/GamificationContext'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

const tierColors = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent'
}

const badgeCategoryLabels: Record<string, string> = {
  consistency: 'Consistencia',
  performance: 'Rendimiento',
  milestone: 'Hitos',
  special: 'Especiales',
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { badges } = useGamification()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const points = user?.stats.points ?? 0
  const levelInfo = getLevelInfo(points)
  const pointsInLevel = points - levelInfo.minPoints
  const pointsNeeded = levelInfo.maxPoints === Infinity ? 1000 : levelInfo.maxPoints - levelInfo.minPoints
  const levelProgress = Math.min(100, (pointsInLevel / pointsNeeded) * 100)

  const unlockedBadges = badges.filter(b => !b.locked)

  const badgesByCategory = badges.reduce<Record<string, typeof badges>>((acc, b) => {
    if (!acc[b.category]) acc[b.category] = []
    acc[b.category].push(b)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Administra tu información y revisa tus logros</p>
      </motion.div>

      {/* Profile card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-28 h-28">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90" aria-label="Cambiar foto">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start flex-wrap">
                <Badge className={`capitalize ${tierColors[user?.subscription || 'basic']}`}>
                  <Crown className="w-3 h-3 mr-1" aria-hidden="true" />
                  {user?.subscription}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Desde {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : ''}
                </span>
              </div>
            </div>

            {/* Level badge */}
            <div className="flex flex-col items-center gap-2 px-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex flex-col items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-xl font-bold">{levelInfo.level}</span>
              </div>
              <span className="text-sm font-medium">{levelInfo.title}</span>
              <span className="text-xs text-muted-foreground">{points} pts</span>
            </div>
          </div>

          {/* Level progress */}
          {levelInfo.maxPoints !== Infinity && (
            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Nivel {levelInfo.level} — {levelInfo.title}</span>
                <span>{points} / {levelInfo.maxPoints} pts para nivel {levelInfo.level + 1}</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{user?.stats.workoutsCompleted}</p>
            <p className="text-sm text-muted-foreground">Entrenamientos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{user?.stats.currentStreak}</p>
            <p className="text-sm text-muted-foreground">Racha actual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{Math.floor((user?.stats.totalMinutes || 0) / 60)}h</p>
            <p className="text-sm text-muted-foreground">Tiempo total</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Info / Badges */}
      <Tabs defaultValue="info">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">Información</TabsTrigger>
          <TabsTrigger value="badges" className="flex-1">
            Badges
            <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-1.5">{unlockedBadges.length}</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex-1">Suscripción</TabsTrigger>
        </TabsList>

        {/* Info tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Información Personal</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <Input id="profile-name" value={name} onChange={e => setName(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <Input id="profile-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </div>
              <Button onClick={() => toast.success('Perfil actualizado')}>
                <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader><CardTitle className="text-destructive">Zona de Peligro</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Eliminar cuenta</p>
                  <p className="text-sm text-muted-foreground">Esta acción es irreversible</p>
                </div>
                <Button variant="destructive" size="sm">Eliminar Cuenta</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges tab */}
        <TabsContent value="badges" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{unlockedBadges.length} de {badges.length} desbloqueados</p>
            <Progress value={(unlockedBadges.length / badges.length) * 100} className="w-32 h-2" />
          </div>

          {Object.entries(badgesByCategory).map(([cat, catBadges]) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {badgeCategoryLabels[cat] ?? cat}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {catBadges.map(badge => (
                  <div
                    key={badge.id}
                    title={badge.requirement}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      badge.locked
                        ? 'border-border bg-secondary/30 opacity-50'
                        : 'border-primary/30 bg-primary/5'
                    }`}
                  >
                    <div className={`text-4xl mb-2 ${badge.locked ? 'grayscale' : ''}`} aria-hidden="true">
                      {badge.locked ? '🔒' : badge.icon}
                    </div>
                    <p className="text-xs font-semibold">{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{badge.requirement}</p>
                    {!badge.locked && badge.unlockedAt && (
                      <p className="text-[10px] text-primary mt-1">
                        {new Date(badge.unlockedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Subscription tab */}
        <TabsContent value="subscription">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize">Plan {user?.subscription}</p>
                    <p className="text-sm text-muted-foreground">Próxima facturación: 15 de Junio, 2026</p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/pricing">
                    <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                    Cambiar Plan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
