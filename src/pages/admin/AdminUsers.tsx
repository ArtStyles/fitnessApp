import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, MoreHorizontal, Mail, Crown, Ban, Check, Edit, Trash2, X, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfirmDeleteModal } from '@/src/components/ui/ConfirmDeleteModal'
import { toast } from 'sonner'
import type { SubscriptionTier } from '@/src/types'

interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
  subscription: SubscriptionTier
  role: 'user' | 'admin'
  status: 'active' | 'suspended'
  joinedAt: string
  lastActive: string
  workoutsCompleted: number
}

const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    subscription: 'premium',
    role: 'user',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2024-03-10',
    workoutsCompleted: 47
  },
  {
    id: '2',
    name: 'Carlos Lopez',
    email: 'carlos@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    subscription: 'vip',
    role: 'user',
    status: 'active',
    joinedAt: '2023-11-20',
    lastActive: '2024-03-10',
    workoutsCompleted: 89
  },
  {
    id: '3',
    name: 'Ana Martinez',
    email: 'ana@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    subscription: 'basic',
    role: 'user',
    status: 'active',
    joinedAt: '2024-02-01',
    lastActive: '2024-03-09',
    workoutsCompleted: 23
  },
  {
    id: '4',
    name: 'Roberto Diaz',
    email: 'roberto@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    subscription: 'premium',
    role: 'user',
    status: 'suspended',
    joinedAt: '2023-08-10',
    lastActive: '2024-02-15',
    workoutsCompleted: 156
  },
  {
    id: '5',
    name: 'Laura Sanchez',
    email: 'laura@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    subscription: 'vip',
    role: 'admin',
    status: 'active',
    joinedAt: '2023-06-01',
    lastActive: '2024-03-10',
    workoutsCompleted: 234
  },
]

const tierColors: Record<SubscriptionTier, string> = {
  basic: 'bg-secondary text-secondary-foreground',
  premium: 'bg-primary/20 text-primary',
  vip: 'bg-accent/20 text-accent'
}

interface UserFormData {
  name: string
  email: string
  avatar: string
  subscription: SubscriptionTier
  role: 'user' | 'admin'
  status: 'active' | 'suspended'
}

const initialFormData: UserFormData = {
  name: '',
  email: '',
  avatar: '',
  subscription: 'basic',
  role: 'user',
  status: 'active'
}

export default function AdminUsers() {
  const [users, setUsers] = useState(mockAdminUsers)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState<UserFormData>(initialFormData)

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      subscription: user.subscription,
      role: user.role,
      status: user.status
    })
    setIsModalOpen(true)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      setUsers(users.filter(u => u.id !== deleteTarget.id))
      toast.success('Usuario eliminado correctamente')
      setDeleteTarget(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error('Por favor completa nombre y email')
      return
    }

    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ))
      toast.success('Usuario actualizado correctamente')
    } else {
      const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        ...formData,
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        workoutsCompleted: 0
      }
      setUsers([newUser, ...users])
      toast.success('Usuario creado correctamente')
    }
    closeModal()
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData(initialFormData)
  }

  const openNewModal = () => {
    setEditingUser(null)
    setFormData(initialFormData)
    setIsModalOpen(true)
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'suspended' : 'active'
        toast.success(`Usuario ${newStatus === 'active' ? 'activado' : 'suspendido'}`)
        return { ...user, status: newStatus }
      }
      return user
    }))
  }

  const handleChangeTier = (userId: string, tier: SubscriptionTier) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        toast.success(`Plan cambiado a ${tier}`)
        return { ...user, subscription: tier }
      }
      return user
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Usuarios</h1>
            <p className="text-muted-foreground">
              Gestiona los usuarios de la plataforma
            </p>
          </div>
        </div>
        <Button onClick={openNewModal} className="bg-purple-500 hover:bg-purple-600">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-sm text-muted-foreground">Total Usuarios</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-green-500">
            {users.filter(u => u.status === 'active').length}
          </p>
          <p className="text-sm text-muted-foreground">Activos</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-primary">
            {users.filter(u => u.subscription === 'premium').length}
          </p>
          <p className="text-sm text-muted-foreground">Premium</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-accent">
            {users.filter(u => u.subscription === 'vip').length}
          </p>
          <p className="text-sm text-muted-foreground">VIP</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Entrenamientos</TableHead>
              <TableHead>Ultimo Acceso</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        {user.role === 'admin' && (
                          <Badge variant="outline" className="text-xs">Admin</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`capitalize ${tierColors[user.subscription]}`}>
                    <Crown className="w-3 h-3 mr-1" />
                    {user.subscription}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={user.status === 'active' 
                      ? 'border-green-500 text-green-500' 
                      : 'border-red-500 text-red-500'
                    }
                  >
                    {user.status === 'active' ? 'Activo' : 'Suspendido'}
                  </Badge>
                </TableCell>
                <TableCell>{user.workoutsCompleted}</TableCell>
                <TableCell>
                  {new Date(user.lastActive).toLocaleDateString('es-ES')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleChangeTier(user.id, 'basic')}>
                          Cambiar a Basico
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeTier(user.id, 'premium')}>
                          Cambiar a Premium
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeTier(user.id, 'vip')}>
                          Cambiar a VIP
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(user.id)}
                          className={user.status === 'active' ? 'text-red-500' : 'text-green-500'}
                        >
                          {user.status === 'active' ? (
                            <>
                              <Ban className="w-4 h-4 mr-2" />
                              Suspender
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeleteTarget(user)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {editingUser ? 'Modifica los datos del usuario' : 'Crea un nuevo usuario'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Avatar Preview */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="text-xl">
                      {formData.name.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatar">URL de Avatar</Label>
                    <Input
                      id="avatar"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Perez"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plan de Suscripcion</Label>
                    <Select
                      value={formData.subscription}
                      onValueChange={(value) => setFormData({ ...formData, subscription: value as SubscriptionTier })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basico</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value as 'user' | 'admin' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'suspended' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="suspended">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button className="flex-1 bg-purple-500 hover:bg-purple-600" onClick={handleSubmit}>
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        description="Esta accion no se puede deshacer. El usuario sera eliminado permanentemente junto con todos sus datos."
        itemName={deleteTarget?.name}
      />
    </div>
  )
}
