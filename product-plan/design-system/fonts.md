# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
  rel="stylesheet"
/>
```

Or in CSS:

```css
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap");
```

## Font Usage

### Space Grotesk (Headings)

Modern geometric sans-serif with distinctive character. Use for:

- Page titles
- Section headings
- Brand elements
- Navigation labels (when expanded)

```css
.heading {
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
}
```

### Inter (Body)

Clean, highly readable sans-serif optimized for screens. Use for:

- Body text
- Form labels and inputs
- Table content
- Descriptions
- UI text

```css
.body {
  font-family: "Inter", sans-serif;
  font-weight: 400;
}
```

### IBM Plex Mono (Code/Technical)

Professional monospace font. Use for:

- Code snippets
- Invoice numbers
- IDs and technical identifiers
- Data fields with fixed formatting

```css
.mono {
  font-family: "IBM Plex Mono", monospace;
  font-weight: 400;
}
```

## Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
};
```

## Usage in Components

```jsx
// Page title
<h1 className="font-heading text-2xl font-semibold text-stone-900 dark:text-stone-100">
  Clients
</h1>

// Section heading
<h2 className="font-heading text-lg font-medium text-stone-800 dark:text-stone-200">
  Active Projects
</h2>

// Body text
<p className="font-body text-stone-600 dark:text-stone-400">
  Manage your client relationships and track engagement health.
</p>

// Invoice number
<span className="font-mono text-sm text-stone-500">
  INV-2025-001
</span>

// Code/ID
<code className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
  client-abc123
</code>
```

## Typography Scale

| Class       | Size            | Usage                               |
| ----------- | --------------- | ----------------------------------- |
| `text-xs`   | 0.75rem (12px)  | Timestamps, badges, metadata        |
| `text-sm`   | 0.875rem (14px) | Labels, table cells, secondary text |
| `text-base` | 1rem (16px)     | Body text, form inputs              |
| `text-lg`   | 1.125rem (18px) | Section headings, card titles       |
| `text-xl`   | 1.25rem (20px)  | Subpage titles                      |
| `text-2xl`  | 1.5rem (24px)   | Page titles                         |
| `text-3xl`  | 1.875rem (30px) | Large metric values                 |
