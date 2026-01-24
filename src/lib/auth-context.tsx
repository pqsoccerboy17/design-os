import { createContext, useContext, type ReactNode } from 'react'

// RBAC Role definitions
export type Role = 'admin' | 'manager' | 'member' | 'viewer'

// Granular permissions for resources
export type Permission =
  // Client permissions
  | 'clients:read'
  | 'clients:write'
  | 'clients:delete'
  // Project permissions
  | 'projects:read'
  | 'projects:write'
  | 'projects:delete'
  // Task permissions
  | 'tasks:read'
  | 'tasks:write'
  | 'tasks:assign'
  // Invoice permissions
  | 'invoicing:read'
  | 'invoicing:write'
  | 'invoicing:approve'
  // Time entry permissions
  | 'time:read'
  | 'time:write'
  // Admin permissions
  | 'admin:access'
  | 'admin:users'
  | 'admin:audit'
  | 'admin:data'

// Role to permission mapping
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'clients:read', 'clients:write', 'clients:delete',
    'projects:read', 'projects:write', 'projects:delete',
    'tasks:read', 'tasks:write', 'tasks:assign',
    'invoicing:read', 'invoicing:write', 'invoicing:approve',
    'time:read', 'time:write',
    'admin:access', 'admin:users', 'admin:audit', 'admin:data',
  ],
  manager: [
    'clients:read', 'clients:write',
    'projects:read', 'projects:write',
    'tasks:read', 'tasks:write', 'tasks:assign',
    'invoicing:read', 'invoicing:write', 'invoicing:approve',
    'time:read', 'time:write',
  ],
  member: [
    'clients:read',
    'projects:read',
    'tasks:read', 'tasks:write',
    'invoicing:read',
    'time:read', 'time:write',
  ],
  viewer: [
    'clients:read',
    'projects:read',
    'tasks:read',
    'invoicing:read',
    'time:read',
  ],
}

// Authenticated user type
export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
}

// Context value type
interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  permissions: Permission[]
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: Role) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
  user: AuthUser | null
  onLogout?: () => void
}

export function AuthProvider({ children, user, onLogout }: AuthProviderProps) {
  const permissions = user ? rolePermissions[user.role] : []

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission)
  }

  const hasRole = (role: Role): boolean => {
    if (!user) return false
    const roleHierarchy: Role[] = ['viewer', 'member', 'manager', 'admin']
    const userRoleIndex = roleHierarchy.indexOf(user.role)
    const requiredRoleIndex = roleHierarchy.indexOf(role)
    return userRoleIndex >= requiredRoleIndex
  }

  const logout = () => {
    onLogout?.()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions,
        hasPermission,
        hasRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

export function useRole(role: Role): boolean {
  const { hasRole } = useAuth()
  return hasRole(role)
}
