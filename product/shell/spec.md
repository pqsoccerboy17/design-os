# Application Shell Specification

## Overview

YourCo uses a clean sidebar layout optimized for consulting workflow management. The design follows Nordic/Scandinavian principles: generous white space, warm neutral tones, and clear visual hierarchy. Primary navigation lives in a collapsible left sidebar, with the main content area taking the remaining space.

## Navigation Structure

- Clients → Client profiles and engagement overview
- Projects → Project tracking with phases and milestones
- Tasks → Task management with risks and questions
- Dashboards → Internal analytics and client status pages
- Invoicing → Invoice generation and payment tracking
- Settings → User preferences and account management

## User Menu

Located at the bottom of the sidebar. Displays user avatar (or initials), name, and a dropdown with account settings and logout options. Uses the warm stone color palette for avatar background.

## Layout Pattern

Sidebar navigation with collapsible behavior. The sidebar contains the app logo at top, navigation items in the middle, and user menu at bottom. Main content area fills remaining width with comfortable padding.

**Sidebar Width:**
- Expanded: 240px
- Collapsed: 64px (icon-only mode)

**Content Area:**
- Max-width: none (full width)
- Padding: 24px on desktop, 16px on mobile

## Responsive Behavior

- **Desktop:** Full sidebar visible, can be collapsed to icon-only mode
- **Tablet:** Sidebar collapsed by default, overlay mode on toggle
- **Mobile:** Bottom navigation bar with 5 main items, settings in user menu

## Design Notes

- Use `stone` palette for sidebar background (stone-50 light, stone-900 dark)
- Use `amber` for active nav item accent and hover states
- Use `zinc` for text and borders
- Typography: Space Grotesk for logo/headings, Inter for nav labels
- Icons: lucide-react, 20px size for nav items
- Transitions: 200ms ease for collapse/expand animations
