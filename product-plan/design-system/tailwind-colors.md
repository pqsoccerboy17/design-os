# Tailwind Color Configuration

## Color Choices

- **Primary:** `stone` — Warm, professional neutral for backgrounds, text, and borders
- **Secondary:** `amber` — Energetic accent for CTAs, active states, highlights, and the brand mark
- **Neutral:** `zinc` — Cool neutral for dark mode backgrounds

## Tailwind Config

If using Tailwind CSS, these colors are built-in. No custom configuration needed.

```js
// tailwind.config.js (optional customization)
module.exports = {
  theme: {
    extend: {
      colors: {
        // Using Tailwind's built-in stone, amber, and zinc
        // Add semantic aliases if desired:
        primary: colors.stone,
        secondary: colors.amber,
        neutral: colors.zinc,
      },
    },
  },
};
```

## Usage Examples

### Buttons

```jsx
// Primary button
<button className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-xl">
  Create Client
</button>

// Secondary button
<button className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-4 py-2 rounded-xl dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300">
  Cancel
</button>

// Ghost button
<button className="text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-2 rounded-lg dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800">
  View Details
</button>
```

### Badges

```jsx
// Status badges
<span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
  Active
</span>

<span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
  At Risk
</span>

<span className="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
  Critical
</span>
```

### Cards

```jsx
<div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm p-6">
  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
    Card Title
  </h3>
  <p className="text-stone-600 dark:text-stone-400 mt-2">
    Card content goes here.
  </p>
</div>
```

### Navigation

```jsx
// Active nav item
<a className="bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 px-3 py-2 rounded-xl font-medium">
  Dashboard
</a>

// Inactive nav item
<a className="text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100 px-3 py-2 rounded-xl">
  Clients
</a>
```

## Health Score Colors

- Healthy (70-100): `emerald-500`
- At Risk (40-69): `amber-500`
- Critical (0-39): `rose-500`

## Status Colors

### Project Status

- Planning: `stone-400`
- Active: `emerald-500`
- On Hold: `amber-500`
- Completed: `emerald-600`
- Cancelled: `rose-500`

### Task Status

- Backlog: `stone-400` (dashed border)
- In Progress: `blue-500`
- Review: `amber-500`
- Done: `emerald-500`

### Invoice Status

- Draft: `gray-500`
- Sent: `blue-500`
- Paid: `emerald-500`
- Overdue: `rose-500`
- Cancelled: `gray-400`

### Priority

- Low: `stone-400`
- Medium: `amber-500`
- High: `orange-500`
- Critical: `rose-500`
