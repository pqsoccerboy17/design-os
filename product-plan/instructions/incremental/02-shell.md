# Milestone 2: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**

- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)

**What you need to build:**

- Authentication and user session management
- Integration of shell components with your router
- User context and logout functionality

**Important guidelines:**

- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** implement proper error handling and loading states
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the application shell with Arc Browser-inspired sidebar navigation, user menu, and responsive layout.

## Overview

The shell provides the core layout structure for YourCo:

- Collapsible sidebar with navigation icons and labels
- User menu with avatar and dropdown
- Responsive design with mobile menu overlay
- Keyboard shortcuts for power users

**Key Features:**

- View sidebar in collapsed (icons only) or expanded (icons + labels) mode
- Hover to "peek" navigation labels when collapsed
- Toggle sidebar with `Cmd/Ctrl + B`
- Mobile: hamburger menu with overlay navigation

## Components

Copy the shell components from `product-plan/shell/components/`:

| Component         | Description                                       |
| ----------------- | ------------------------------------------------- |
| `AppShell`        | Main layout wrapper with sidebar and content area |
| `MainNav`         | Navigation links with Lucide icons                |
| `UserMenu`        | User avatar, name, and dropdown menu              |
| `useLocalStorage` | Hook for persisting sidebar state                 |

### Dependencies

The shell components require:

- `lucide-react` for icons
- React 18+

```bash
npm install lucide-react
```

## Integration

### 1. Wrap Your App

```tsx
import { AppShell } from "./shell/components";

function App() {
  const navigationItems = [
    { label: "Dashboard", href: "/", isActive: location.pathname === "/" },
    {
      label: "Clients",
      href: "/clients",
      isActive: location.pathname.startsWith("/clients"),
    },
    {
      label: "Projects",
      href: "/projects",
      isActive: location.pathname.startsWith("/projects"),
    },
    {
      label: "Tasks",
      href: "/tasks",
      isActive: location.pathname.startsWith("/tasks"),
    },
    {
      label: "Invoicing",
      href: "/invoicing",
      isActive: location.pathname.startsWith("/invoicing"),
    },
    {
      label: "Settings",
      href: "/admin",
      isActive: location.pathname.startsWith("/admin"),
    },
  ];

  const user = {
    name: "Alex Rivera",
    avatarUrl: undefined, // Or user's avatar URL
  };

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => navigate(href)}
      onLogout={() => signOut()}
    >
      <Routes>{/* Your routes */}</Routes>
    </AppShell>
  );
}
```

### 2. Wire Up Navigation

The `onNavigate` callback receives the `href` when a nav item is clicked. Connect this to your router:

```tsx
// React Router
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
onNavigate={(href) => navigate(href)}

// Next.js
import { useRouter } from 'next/router'

const router = useRouter()
onNavigate={(href) => router.push(href)}
```

### 3. Wire Up User Menu

The shell expects user info from your auth context:

```tsx
// From your auth provider
const { user, signOut } = useAuth()

<AppShell
  user={user ? { name: user.name, avatarUrl: user.avatarUrl } : undefined}
  onLogout={signOut}
>
```

### 4. Set Active State

Update `isActive` based on current route:

```tsx
const location = useLocation();

const navigationItems = [
  {
    label: "Clients",
    href: "/clients",
    isActive: location.pathname.startsWith("/clients"),
  },
  // ...
];
```

## Sidebar States

| State     | Width | Labels  | When                      |
| --------- | ----- | ------- | ------------------------- |
| Collapsed | 64px  | Hidden  | User collapsed via toggle |
| Peek      | 200px | Visible | Hover when collapsed      |
| Expanded  | 240px | Visible | Default or user expanded  |

The sidebar state persists to localStorage (`yourco-sidebar-state`).

## Keyboard Shortcuts

| Shortcut       | Action                            |
| -------------- | --------------------------------- |
| `Cmd/Ctrl + B` | Toggle sidebar collapsed/expanded |

## Responsive Behavior

**Desktop (≥768px):**

- Sidebar navigation on left (or right if configured)
- Collapsible with peek on hover

**Mobile (<768px):**

- Fixed header with hamburger menu
- Full-width overlay navigation
- Sidebar hidden

## Props Reference

### AppShell

| Prop              | Type                                 | Default   | Description          |
| ----------------- | ------------------------------------ | --------- | -------------------- |
| `children`        | ReactNode                            | required  | Main content         |
| `navigationItems` | NavigationItem[]                     | required  | Nav links            |
| `user`            | { name: string; avatarUrl?: string } | undefined | Current user         |
| `onNavigate`      | (href: string) => void               | undefined | Navigation callback  |
| `onLogout`        | () => void                           | undefined | Logout callback      |
| `sidebarPosition` | 'left' \| 'right'                    | 'left'    | Sidebar position     |
| `enablePeek`      | boolean                              | true      | Enable peek on hover |

### NavigationItem

```typescript
interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}
```

## Files to Reference

- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — React components

## Done When

- [ ] Shell renders with navigation sidebar
- [ ] Navigation links to correct routes
- [ ] Active state highlights current section
- [ ] Sidebar collapses and expands
- [ ] Peek works on hover when collapsed
- [ ] `Cmd/Ctrl + B` toggles sidebar
- [ ] User menu shows current user
- [ ] Logout works
- [ ] Responsive on mobile (hamburger menu)
