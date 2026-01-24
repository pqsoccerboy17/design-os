import type { ReactNode } from 'react'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type Permission, type Role } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function AccessDenied() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <ShieldX className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle>Access Denied</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            You don't have permission to access this page.
            {user && (
              <span className="block mt-2">
                Current role: <span className="font-medium capitalize">{user.role}</span>
              </span>
            )}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

interface ProtectedRouteProps {
  children: ReactNode
  permission?: Permission
  role?: Role
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  permission,
  role,
  fallback = <AccessDenied />,
}: ProtectedRouteProps) {
  const { hasPermission, hasRole, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
