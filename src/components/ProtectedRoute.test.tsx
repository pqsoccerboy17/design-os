import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { ProtectedRoute } from "./ProtectedRoute";
import { renderWithProviders, mockUsers } from "@/test/test-utils";

describe("ProtectedRoute", () => {
  describe("authentication", () => {
    it("renders children when user is authenticated", () => {
      renderWithProviders(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { user: mockUsers.member },
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("renders fallback when user is not authenticated", () => {
      renderWithProviders(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { user: null },
      );

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(screen.getByText("Access Denied")).toBeInTheDocument();
    });
  });

  describe("permission checks", () => {
    it("renders children when user has required permission", () => {
      renderWithProviders(
        <ProtectedRoute permission="clients:read">
          <div>Protected Content</div>
        </ProtectedRoute>,
        { user: mockUsers.viewer },
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("renders fallback when user lacks required permission", () => {
      renderWithProviders(
        <ProtectedRoute permission="admin:access">
          <div>Admin Only Content</div>
        </ProtectedRoute>,
        { user: mockUsers.viewer },
      );

      expect(screen.queryByText("Admin Only Content")).not.toBeInTheDocument();
      expect(screen.getByText("Access Denied")).toBeInTheDocument();
    });

    it("renders children when admin has elevated permissions", () => {
      renderWithProviders(
        <ProtectedRoute permission="clients:delete">
          <div>Delete Content</div>
        </ProtectedRoute>,
        { user: mockUsers.admin },
      );

      expect(screen.getByText("Delete Content")).toBeInTheDocument();
    });
  });

  describe("role checks", () => {
    it("renders children when user has required role", () => {
      renderWithProviders(
        <ProtectedRoute role="manager">
          <div>Manager Content</div>
        </ProtectedRoute>,
        { user: mockUsers.manager },
      );

      expect(screen.getByText("Manager Content")).toBeInTheDocument();
    });

    it("renders children when user has higher role than required", () => {
      renderWithProviders(
        <ProtectedRoute role="member">
          <div>Member Content</div>
        </ProtectedRoute>,
        { user: mockUsers.admin },
      );

      expect(screen.getByText("Member Content")).toBeInTheDocument();
    });

    it("renders fallback when user has lower role than required", () => {
      renderWithProviders(
        <ProtectedRoute role="admin">
          <div>Admin Content</div>
        </ProtectedRoute>,
        { user: mockUsers.member },
      );

      expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
      expect(screen.getByText("Access Denied")).toBeInTheDocument();
    });
  });

  describe("custom fallback", () => {
    it("renders custom fallback instead of default AccessDenied", () => {
      renderWithProviders(
        <ProtectedRoute
          permission="admin:access"
          fallback={<div>Custom Access Denied</div>}
        >
          <div>Protected Content</div>
        </ProtectedRoute>,
        { user: mockUsers.viewer },
      );

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(screen.queryByText("Access Denied")).not.toBeInTheDocument();
      expect(screen.getByText("Custom Access Denied")).toBeInTheDocument();
    });

    it("renders custom fallback when unauthenticated", () => {
      renderWithProviders(
        <ProtectedRoute fallback={<div>Please log in</div>}>
          <div>Protected Content</div>
        </ProtectedRoute>,
        { user: null },
      );

      expect(screen.getByText("Please log in")).toBeInTheDocument();
    });
  });

  describe("AccessDenied component", () => {
    it("displays current user role in access denied message", () => {
      renderWithProviders(
        <ProtectedRoute permission="admin:access">
          <div>Admin Content</div>
        </ProtectedRoute>,
        { user: mockUsers.member },
      );

      expect(screen.getByText(/Current role:/)).toBeInTheDocument();
      expect(screen.getByText(/member/i)).toBeInTheDocument();
    });

    it("displays go back button", () => {
      renderWithProviders(
        <ProtectedRoute permission="admin:access">
          <div>Admin Content</div>
        </ProtectedRoute>,
        { user: mockUsers.viewer },
      );

      expect(
        screen.getByRole("button", { name: /go back/i }),
      ).toBeInTheDocument();
    });
  });
});
