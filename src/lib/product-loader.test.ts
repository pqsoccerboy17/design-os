import { describe, it, expect } from "vitest";
import { parseProductOverview, parseProductRoadmap } from "./product-loader";

describe("parseProductOverview", () => {
  const validMarkdown = `# My Product

## Description
A great product that solves problems.

## Problems & Solutions

### Problem 1: Slow Workflow
Automates repetitive tasks to save time.

### Problem 2: Data Silos
Integrates with existing tools for unified data.

## Key Features
- Real-time dashboards
- Automated reporting
- Team collaboration
`;

  it("parses a valid product overview", () => {
    const result = parseProductOverview(validMarkdown);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("My Product");
    expect(result!.description).toBe("A great product that solves problems.");
    expect(result!.problems).toHaveLength(2);
    expect(result!.features).toHaveLength(3);
  });

  it("extracts problem titles and solutions", () => {
    const result = parseProductOverview(validMarkdown);
    expect(result!.problems[0].title).toBe("Slow Workflow");
    expect(result!.problems[0].solution).toBe(
      "Automates repetitive tasks to save time.",
    );
    expect(result!.problems[1].title).toBe("Data Silos");
  });

  it("extracts feature list", () => {
    const result = parseProductOverview(validMarkdown);
    expect(result!.features).toEqual([
      "Real-time dashboards",
      "Automated reporting",
      "Team collaboration",
    ]);
  });

  it("returns null for empty string", () => {
    expect(parseProductOverview("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(parseProductOverview("   \n  \n  ")).toBeNull();
  });

  it("returns null when no meaningful content is found", () => {
    expect(parseProductOverview("# Just A Title\n\nSome text.")).toBeNull();
  });

  it("uses default name when no heading found", () => {
    const md = `## Description
Some product description here.
`;
    const result = parseProductOverview(md);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Product Overview");
  });

  it("handles overview with only description", () => {
    const md = `# Test Product

## Description
Only a description, no problems or features.
`;
    const result = parseProductOverview(md);
    expect(result).not.toBeNull();
    expect(result!.description).toBe(
      "Only a description, no problems or features.",
    );
    expect(result!.problems).toHaveLength(0);
    expect(result!.features).toHaveLength(0);
  });
});

describe("parseProductRoadmap", () => {
  const validMarkdown = `# Product Roadmap

## Sections

### 1. Client Management
Manage client relationships and onboarding.

### 2. Project Tracking
Track project progress and milestones.

### 3. Invoicing
Generate and manage invoices.
`;

  it("parses valid roadmap sections", () => {
    const result = parseProductRoadmap(validMarkdown);
    expect(result).not.toBeNull();
    expect(result!.sections).toHaveLength(3);
  });

  it("extracts section titles and descriptions", () => {
    const result = parseProductRoadmap(validMarkdown);
    expect(result!.sections[0].title).toBe("Client Management");
    expect(result!.sections[0].description).toBe(
      "Manage client relationships and onboarding.",
    );
  });

  it("sorts sections by order", () => {
    const result = parseProductRoadmap(validMarkdown);
    expect(result!.sections[0].order).toBe(1);
    expect(result!.sections[1].order).toBe(2);
    expect(result!.sections[2].order).toBe(3);
  });

  it("generates slugified IDs", () => {
    const result = parseProductRoadmap(validMarkdown);
    expect(result!.sections[0].id).toBe("client-management");
    expect(result!.sections[1].id).toBe("project-tracking");
  });

  it("slugifies ampersands to -and-", () => {
    const md = `### 1. Sales & Marketing
Description here.
`;
    const result = parseProductRoadmap(md);
    expect(result).not.toBeNull();
    expect(result!.sections[0].id).toBe("sales-and-marketing");
  });

  it("returns null for empty string", () => {
    expect(parseProductRoadmap("")).toBeNull();
  });

  it("returns null when no sections found", () => {
    expect(
      parseProductRoadmap("# Roadmap\n\nSome text without sections."),
    ).toBeNull();
  });
});
