import { describe, it, expect } from "vitest";
import { parseSpec } from "./section-loader";

describe("parseSpec", () => {
  const validSpec = `# Invoice Management Specification

## Overview
Manage invoices for client billing and payment tracking.

## User Flows
- Create new invoice from time entries
- Send invoice to client via email
- Mark invoice as paid

## UI Requirements
- Sortable invoice table
- PDF export button
- Payment status badges
`;

  it("parses a valid spec with all sections", () => {
    const result = parseSpec(validSpec);
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Invoice Management Specification");
    expect(result!.overview).toBe(
      "Manage invoices for client billing and payment tracking.",
    );
    expect(result!.userFlows).toHaveLength(3);
    expect(result!.uiRequirements).toHaveLength(3);
  });

  it("extracts user flows", () => {
    const result = parseSpec(validSpec);
    expect(result!.userFlows[0]).toBe("Create new invoice from time entries");
    expect(result!.userFlows[1]).toBe("Send invoice to client via email");
    expect(result!.userFlows[2]).toBe("Mark invoice as paid");
  });

  it("extracts UI requirements", () => {
    const result = parseSpec(validSpec);
    expect(result!.uiRequirements[0]).toBe("Sortable invoice table");
    expect(result!.uiRequirements[1]).toBe("PDF export button");
    expect(result!.uiRequirements[2]).toBe("Payment status badges");
  });

  it("defaults useShell to true", () => {
    const result = parseSpec(validSpec);
    expect(result!.useShell).toBe(true);
  });

  it("detects shell: false configuration", () => {
    const specWithShellDisabled = `# Login Page

## Overview
A standalone login page.

## Configuration
- shell: false
`;
    const result = parseSpec(specWithShellDisabled);
    expect(result).not.toBeNull();
    expect(result!.useShell).toBe(false);
  });

  it("detects shell: false without bullet prefix", () => {
    const specWithShellDisabled = `# Login Page

## Overview
A standalone login page.

## Configuration
shell: false
`;
    const result = parseSpec(specWithShellDisabled);
    expect(result).not.toBeNull();
    expect(result!.useShell).toBe(false);
  });

  it("returns null for empty string", () => {
    expect(parseSpec("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(parseSpec("   \n  ")).toBeNull();
  });

  it("returns a spec even with just a title (title counts as content)", () => {
    const result = parseSpec("# Title Only");
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Title Only");
    expect(result!.overview).toBe("");
    expect(result!.userFlows).toHaveLength(0);
  });

  it("uses default title when no heading found", () => {
    const md = `## Overview
Some overview content here.
`;
    const result = parseSpec(md);
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Section Specification");
  });

  it("handles spec with only overview", () => {
    const md = `# My Section

## Overview
Just an overview, nothing else.
`;
    const result = parseSpec(md);
    expect(result).not.toBeNull();
    expect(result!.overview).toBe("Just an overview, nothing else.");
    expect(result!.userFlows).toHaveLength(0);
    expect(result!.uiRequirements).toHaveLength(0);
  });
});
