# YourCo Application Shell

## Overview

The application shell provides the core layout structure with an Arc Browser-inspired sidebar navigation. It includes:

- **AppShell** — Main layout wrapper with sidebar and content area
- **MainNav** — Navigation links with icons
- **UserMenu** — User avatar, name, and dropdown with settings/logout

## Design Inspiration

The sidebar takes cues from Arc Browser's collapsible navigation:

- **Collapsed state** — Icon-only navigation (64px wide)
- **Peek state** — Expands on hover when collapsed (200px)
- **Expanded state** — Full navigation with labels (240px)

The sidebar position can be configured (left or right), and the entire shell is responsive with a mobile menu overlay.

## Key Features

### Sidebar States

| State     | Width | Labels  | Trigger              |
| --------- | ----- | ------- | -------------------- |
| Collapsed | 64px  | Hidden  | User toggle or Cmd+B |
| Peek      | 200px | Visible | Hover when collapsed |
| Expanded  | 240px | Visible | User toggle or Cmd+B |

### Keyboard Shortcuts

- `Cmd/Ctrl + B` — Toggle sidebar collapsed/expanded

### Responsive Behavior

- **Desktop (≥768px)** — Sidebar navigation
- **Mobile (<768px)** — Top header with hamburger menu, full-width overlay navigation

## Navigation Items

The shell expects navigation items in this format:

```typescript
interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/", isActive: true },
  { label: "Clients", href: "/clients" },
  { label: "Projects", href: "/projects" },
  { label: "Tasks", href: "/tasks" },
  { label: "Invoicing", href: "/invoicing" },
  { label: "Settings", href: "/settings" },
];
```

The MainNav component maps labels to icons:

- Dashboard → LayoutDashboard
- Clients → Users
- Projects → FolderKanban
- Tasks → CheckSquare
- Invoicing → Receipt
- Settings → Settings

## User Menu

The user menu shows:

- User avatar (or initials if no avatar)
- User name (when expanded)
- Dropdown with Settings and Sign out

```typescript
interface User {
  name: string;
  avatarUrl?: string;
}
```

## Props

### AppShell

| Prop            | Type                   | Default   | Description          |
| --------------- | ---------------------- | --------- | -------------------- |
| children        | ReactNode              | required  | Main content         |
| navigationItems | NavigationItem[]       | required  | Nav links            |
| user            | User                   | undefined | Current user         |
| onNavigate      | (href: string) => void | undefined | Navigation callback  |
| onLogout        | () => void             | undefined | Logout callback      |
| sidebarPosition | 'left' \| 'right'      | 'left'    | Sidebar position     |
| enablePeek      | boolean                | true      | Enable peek on hover |

## Styling

The shell uses:

- `stone` for backgrounds and borders
- `amber` for active states and brand elements
- Smooth transitions (200ms) for state changes
- `rounded-xl` for buttons and cards
- Proper dark mode support with zinc backgrounds

## Integration

1. Copy shell components to your project
2. Wire `onNavigate` to your router
3. Wire `onLogout` to your auth system
4. Pass current user from auth context
5. Set `isActive` based on current route
