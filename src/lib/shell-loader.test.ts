import { describe, it, expect } from "vitest";
import { parseShellSpec } from "./shell-loader";

describe("parseShellSpec", () => {
  const validSpec = `# Application Shell Specification

## Overview
A sidebar navigation layout with a top bar for user actions.

## Navigation Structure
- Dashboard
- Clients
- Projects
- Invoicing
- Admin

## Layout Pattern
Sidebar navigation on the left with collapsible menu. Main content area with breadcrumbs.
`;

  it("parses a valid shell spec", () => {
    const result = parseShellSpec(validSpec);
    expect(result).not.toBeNull();
    expect(result!.overview).toContain("sidebar navigation layout");
    expect(result!.navigationItems).toHaveLength(5);
    expect(result!.layoutPattern).toContain("Sidebar navigation");
  });

  it("extracts navigation items", () => {
    const result = parseShellSpec(validSpec);
    expect(result!.navigationItems).toEqual([
      "Dashboard",
      "Clients",
      "Projects",
      "Invoicing",
      "Admin",
    ]);
  });

  it("preserves raw markdown", () => {
    const result = parseShellSpec(validSpec);
    expect(result!.raw).toBe(validSpec);
  });

  it("returns null for empty string", () => {
    expect(parseShellSpec("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(parseShellSpec("   \n  ")).toBeNull();
  });

  it("returns null when no meaningful content found", () => {
    expect(parseShellSpec("# Title Only\n\nSome text.")).toBeNull();
  });

  it("handles spec with only overview", () => {
    const md = `# Shell

## Overview
A minimal top navigation bar.
`;
    const result = parseShellSpec(md);
    expect(result).not.toBeNull();
    expect(result!.overview).toBe("A minimal top navigation bar.");
    expect(result!.navigationItems).toHaveLength(0);
    expect(result!.layoutPattern).toBe("");
  });

  it("handles spec with only navigation", () => {
    const md = `# Shell

## Navigation Structure
- Home
- Settings
`;
    const result = parseShellSpec(md);
    expect(result).not.toBeNull();
    expect(result!.navigationItems).toHaveLength(2);
    expect(result!.overview).toBe("");
  });
});
