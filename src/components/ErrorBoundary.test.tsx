import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Child content</div>;
}

describe("ErrorBoundary", () => {
  describe("normal rendering", () => {
    it("renders children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("renders multiple children", () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
    });
  });

  describe("error catching", () => {
    it("catches errors and displays default fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByText(/An error occurred while rendering/),
      ).toBeInTheDocument();
    });

    it("displays the error message in the UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Test error")).toBeInTheDocument();
    });

    it("logs error to console", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "ErrorBoundary caught an error:",
        expect.any(Error),
        expect.any(Object),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("retry functionality", () => {
    it("displays try again button", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });

    it("resets error state when try again is clicked", async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      function ConditionalError() {
        if (shouldThrow) {
          throw new Error("Test error");
        }
        return <div>Recovered content</div>;
      }

      render(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      shouldThrow = false;
      await user.click(screen.getByRole("button", { name: /try again/i }));

      expect(screen.getByText("Recovered content")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong"),
      ).not.toBeInTheDocument();
    });
  });

  describe("custom fallback", () => {
    it("renders custom fallback when provided", () => {
      render(
        <ErrorBoundary fallback={<div>Custom error message</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Custom error message")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong"),
      ).not.toBeInTheDocument();
    });

    it("does not render custom fallback when no error occurs", () => {
      render(
        <ErrorBoundary fallback={<div>Custom error message</div>}>
          <div>Normal content</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText("Normal content")).toBeInTheDocument();
      expect(
        screen.queryByText("Custom error message"),
      ).not.toBeInTheDocument();
    });
  });
});
