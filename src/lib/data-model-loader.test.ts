import { describe, it, expect } from "vitest";
import { parseDataModel } from "./data-model-loader";

describe("parseDataModel", () => {
  const validMarkdown = `# Data Model

## Entities

### Client
Represents a consulting client with contact information and status.

### Project
A billable project assigned to a client.

### Invoice
A generated invoice for time tracked on projects.

## Relationships

- Client has many Projects
- Project belongs to Client
- Invoice belongs to Project
`;

  it("parses entities from valid markdown", () => {
    const result = parseDataModel(validMarkdown);
    expect(result).not.toBeNull();
    expect(result!.entities).toHaveLength(3);
  });

  it("extracts entity names and descriptions", () => {
    const result = parseDataModel(validMarkdown);
    expect(result!.entities[0].name).toBe("Client");
    expect(result!.entities[0].description).toBe(
      "Represents a consulting client with contact information and status.",
    );
    expect(result!.entities[1].name).toBe("Project");
    expect(result!.entities[2].name).toBe("Invoice");
  });

  it("extracts relationships", () => {
    const result = parseDataModel(validMarkdown);
    expect(result!.relationships).toHaveLength(3);
    expect(result!.relationships[0]).toBe("Client has many Projects");
    expect(result!.relationships[1]).toBe("Project belongs to Client");
    expect(result!.relationships[2]).toBe("Invoice belongs to Project");
  });

  it("returns null for empty string", () => {
    expect(parseDataModel("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(parseDataModel("   \n  ")).toBeNull();
  });

  it("returns null when no entities or relationships found", () => {
    expect(parseDataModel("# Data Model\n\nSome text.")).toBeNull();
  });

  it("handles model with only entities", () => {
    const md = `# Data Model

## Entities

### User
A system user.
`;
    const result = parseDataModel(md);
    expect(result).not.toBeNull();
    expect(result!.entities).toHaveLength(1);
    expect(result!.relationships).toHaveLength(0);
  });

  it("handles model with only relationships", () => {
    const md = `# Data Model

## Relationships

- User has many Posts
`;
    const result = parseDataModel(md);
    expect(result).not.toBeNull();
    expect(result!.entities).toHaveLength(0);
    expect(result!.relationships).toHaveLength(1);
  });
});
