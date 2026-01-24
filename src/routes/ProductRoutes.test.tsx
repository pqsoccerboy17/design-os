import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProductRoutes } from "./ProductRoutes";

vi.mock("@/shell/components/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-shell">{children}</div>
  ),
}));

describe("ProductRoutes", () => {
  function renderWithRoute(initialPath = "/product") {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/product" element={<ProductRoutes />}>
            <Route index element={<div>Product Index</div>} />
            <Route path="clients" element={<div>Clients Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  }

  describe("layout structure", () => {
    it("renders AppShell wrapper", () => {
      renderWithRoute();

      expect(screen.getByTestId("app-shell")).toBeInTheDocument();
    });

    it("renders outlet for child routes", () => {
      renderWithRoute("/product");

      expect(screen.getByText("Product Index")).toBeInTheDocument();
    });

    it("renders child route content", () => {
      renderWithRoute("/product/clients");

      expect(screen.getByText("Clients Page")).toBeInTheDocument();
    });
  });

  describe("auth context provision", () => {
    it("provides auth context to children", () => {
      render(
        <MemoryRouter initialEntries={["/product"]}>
          <Routes>
            <Route path="/product" element={<ProductRoutes />}>
              <Route index element={<TestAuthConsumer />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "authenticated",
      );
      expect(screen.getByTestId("user-role")).toHaveTextContent("admin");
    });
  });
});

import { useAuth } from "@/lib/auth-context";

function TestAuthConsumer() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">
        {isAuthenticated ? "authenticated" : "unauthenticated"}
      </span>
      <span data-testid="user-role">{user?.role}</span>
    </div>
  );
}
