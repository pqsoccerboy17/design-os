import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Types
type SidebarPosition = 'left' | 'right'
type SidebarState = 'collapsed' | 'peek' | 'expanded'

interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

interface User {
  name: string
  avatarUrl?: string
}

interface SidebarConfig {
  defaultExpanded: boolean
  peekOnHover: boolean
  peekDelay: number
}

interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: User
  onNavigate?: (href: string) => void
  onLogout?: () => void
  sidebarPosition?: SidebarPosition
  enablePeek?: boolean
}

const DEFAULT_CONFIG: SidebarConfig = {
  defaultExpanded: true,
  peekOnHover: true,
  peekDelay: 150,
}

// Custom hook for sidebar state management
function useSidebarState(config: SidebarConfig) {
  const [intentState, setIntentState] = useLocalStorage<'collapsed' | 'expanded'>(
    'yourco-sidebar-state',
    config.defaultExpanded ? 'expanded' : 'collapsed'
  )
  const [isHovering, setIsHovering] = useState(false)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect touch device (no hover capability)
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  // Compute actual state based on intent + hover
  const state = useMemo<SidebarState>(() => {
    if (
      intentState === 'collapsed' &&
      isHovering &&
      config.peekOnHover &&
      !isTouchDevice
    ) {
      return 'peek'
    }
    return intentState
  }, [intentState, isHovering, config.peekOnHover, isTouchDevice])

  const toggleSidebar = useCallback(() => {
    setIntentState((prev) => (prev === 'collapsed' ? 'expanded' : 'collapsed'))
    setIsHovering(false)
    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }, [setIntentState])

  const handleMouseEnter = useCallback(() => {
    if (config.peekOnHover && intentState === 'collapsed' && !isTouchDevice) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovering(true)
      }, config.peekDelay)
    }
  }, [config.peekOnHover, config.peekDelay, intentState, isTouchDevice])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovering(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return {
    state,
    intentState,
    toggleSidebar,
    handleMouseEnter,
    handleMouseLeave,
  }
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
  sidebarPosition = 'left',
  enablePeek = true,
}: AppShellProps) {
  const config = { ...DEFAULT_CONFIG, peekOnHover: enablePeek }
  const {
    state: sidebarState,
    toggleSidebar,
    handleMouseEnter,
    handleMouseLeave,
  } = useSidebarState(config)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Global keyboard shortcut: Cmd/Ctrl + B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // Compute sidebar width based on state
  const sidebarWidth = {
    collapsed: 'w-16',
    peek: 'w-[200px]',
    expanded: 'w-60',
  }[sidebarState]

  // Show labels in peek and expanded states
  const showLabels = sidebarState !== 'collapsed'

  // Position-aware classes
  const isRight = sidebarPosition === 'right'
  const borderClass = isRight ? 'border-l' : 'border-r'
  const peekShadowClass =
    sidebarState === 'peek'
      ? isRight
        ? 'sidebar-peek-shadow-right'
        : 'sidebar-peek-shadow'
      : ''

  return (
    <div
      className={`flex h-screen bg-white dark:bg-zinc-950 ${
        isRight ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col
          bg-stone-50 dark:bg-stone-900
          ${borderClass} border-stone-200 dark:border-stone-800
          sidebar-container ${sidebarWidth}
          ${peekShadowClass}
          ${sidebarState === 'peek' ? 'z-30' : ''}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-4 border-b border-stone-200 dark:border-stone-800">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-3 text-stone-900 dark:text-stone-100 group"
            aria-label={
              sidebarState === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar'
            }
            aria-expanded={sidebarState !== 'collapsed'}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm group-hover:shadow-md arc-transition">
              <span className="text-white font-bold text-sm font-heading">Y</span>
            </div>
            {showLabels && (
              <span className="font-heading font-semibold text-lg animate-label-fade">
                YourCo
              </span>
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <MainNav
            items={navigationItems}
            collapsed={sidebarState === 'collapsed'}
            showLabels={showLabels}
            onNavigate={onNavigate}
          />
        </div>

        {/* User Menu */}
        <div className="border-t border-stone-200 dark:border-stone-800 p-2">
          <UserMenu
            user={user}
            collapsed={sidebarState === 'collapsed'}
            showLabels={showLabels}
            sidebarPosition={sidebarPosition}
            onLogout={onLogout}
          />
        </div>
      </aside>

      {/* Mobile Header */}
      <div
        className={`
          md:hidden fixed top-0 left-0 right-0 z-40 h-14
          bg-stone-50 dark:bg-stone-900
          border-b border-stone-200 dark:border-stone-800
          flex items-center justify-between px-4
        `}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <span className="font-heading font-semibold text-lg text-stone-900 dark:text-stone-100">
            YourCo
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-stone-600 dark:text-stone-400"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className={`
              absolute top-14 ${isRight ? 'right-0' : 'left-0'}
              ${isRight ? 'left-auto' : 'right-0'}
              bg-stone-50 dark:bg-stone-900
              border-b border-stone-200 dark:border-stone-800
              p-4
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <MainNav
              items={navigationItems}
              collapsed={false}
              showLabels={true}
              onNavigate={(href) => {
                onNavigate?.(href)
                setMobileMenuOpen(false)
              }}
            />
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <UserMenu
                user={user}
                collapsed={false}
                showLabels={true}
                sidebarPosition={sidebarPosition}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
