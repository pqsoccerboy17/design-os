# Application Shell Specification

## Overview

YourCo uses an Arc Browser-inspired sidebar layout optimized for consulting workflow management. The design follows Nordic/Scandinavian principles: generous white space, warm neutral tones, and clear visual hierarchy. Primary navigation lives in a collapsible sidebar (left or right), with the main content area taking the remaining space.

## Navigation Structure

- Clients → Client profiles and engagement overview
- Projects → Project tracking with phases and milestones
- Tasks → Task management with risks and questions
- Dashboards → Internal analytics and client status pages
- Invoicing → Invoice generation and payment tracking
- Settings → User preferences and account management

## User Menu

Located at the bottom of the sidebar. Displays user avatar (or initials), name, and a dropdown with account settings and logout options. Uses the warm stone color palette for avatar background. Dropdown positions itself relative to sidebar position (left-aligned for left sidebar, right-aligned for right sidebar).

## Layout Pattern

Sidebar navigation with collapsible behavior inspired by Arc Browser. The sidebar contains the app logo at top, navigation items in the middle, and user menu at bottom. Main content area fills remaining width with comfortable padding.

**Sidebar Width:**
- Expanded: 240px
- Peek (hover): 200px
- Collapsed: 64px (icon-only mode)

**Sidebar Position:**
- Configurable: left (default) or right
- Persisted to localStorage

**Content Area:**
- Max-width: none (full width)
- Padding: 24px on desktop, 16px on mobile

## Sidebar States

| State | Width | Labels | Trigger |
|-------|-------|--------|---------|
| `collapsed` | 64px | Hidden | Click logo to collapse |
| `peek` | 200px | Visible | Hover when collapsed (150ms delay) |
| `expanded` | 240px | Visible | Click logo to expand |

## Arc Browser-Inspired Features

### Peek Behavior
When the sidebar is collapsed, hovering over it for 150ms triggers a "peek" state showing labels without fully expanding. This reduces interaction friction while maximizing content space.

### Smooth Animations
- Sidebar width: 250ms cubic-bezier(0.4, 0, 0.2, 1)
- Label fade-in: 200ms ease-out with 50ms delay
- Hover states: 150ms ease-in-out
- GPU-accelerated using `will-change` and `transform`

### Persistence
User preferences for sidebar state (collapsed/expanded) and position (left/right) are persisted to localStorage and sync across tabs.

### Keyboard Shortcut
`Cmd+B` (Mac) / `Ctrl+B` (Windows) toggles sidebar collapse/expand.

## Accessibility

- ARIA attributes: `aria-expanded`, `aria-label`, `aria-haspopup`
- Keyboard navigation: Global shortcut for toggle
- Focus management: Logical focus order preserved
- Screen reader support: State changes announced

## Responsive Behavior

- **Desktop:** Full sidebar visible, can be collapsed to icon-only mode with peek on hover
- **Tablet:** Sidebar collapsed by default, overlay mode on toggle
- **Mobile:** Top header with hamburger menu, overlay navigation
- **Touch devices:** Peek behavior disabled (tap to toggle only)

## Design Notes

- Use `stone` palette for sidebar background (stone-50 light, stone-900 dark)
- Use `amber` for active nav item accent and hover states
- Use `zinc` for text and borders
- Typography: Space Grotesk for logo/headings, Inter for nav labels
- Icons: lucide-react, 20px size for nav items, strokeWidth 1.5
- Border radius: `rounded-xl` (16px) for Arc-style soft corners
- Transitions: 250ms cubic-bezier for collapse/expand animations
- Peek shadow: Subtle box-shadow when in peek state for depth
