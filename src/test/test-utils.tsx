import type { ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { AuthProvider, type AuthUser, type Role } from "@/lib/auth-context";

// Mock user fixtures
export const mockUsers: Record<Role, AuthUser> = {
  admin: {
    id: "user-admin",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatarUrl: "https://example.com/admin.jpg",
  },
  manager: {
    id: "user-manager",
    name: "Manager User",
    email: "manager@example.com",
    role: "manager",
  },
  member: {
    id: "user-member",
    name: "Member User",
    email: "member@example.com",
    role: "member",
  },
  viewer: {
    id: "user-viewer",
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
  },
};

// Auth wrapper options
interface AuthWrapperOptions {
  user?: AuthUser | null;
  onLogout?: () => void;
}

// Router wrapper options
interface RouterWrapperOptions {
  initialEntries?: MemoryRouterProps["initialEntries"];
}

// Combined provider options
interface AllProvidersOptions
  extends AuthWrapperOptions, RouterWrapperOptions {}

// Render with AuthProvider only
export function renderWithAuth(
  ui: ReactNode,
  {
    user = mockUsers.member,
    onLogout,
    ...renderOptions
  }: AuthWrapperOptions & Omit<RenderOptions, "wrapper"> = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AuthProvider user={user} onLogout={onLogout}>
        {children}
      </AuthProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Render with MemoryRouter only
export function renderWithRouter(
  ui: ReactNode,
  {
    initialEntries = ["/"],
    ...renderOptions
  }: RouterWrapperOptions & Omit<RenderOptions, "wrapper"> = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Render with all providers (AuthProvider + MemoryRouter)
export function renderWithProviders(
  ui: ReactNode,
  {
    user = mockUsers.member,
    onLogout,
    initialEntries = ["/"],
    ...renderOptions
  }: AllProvidersOptions & Omit<RenderOptions, "wrapper"> = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider user={user} onLogout={onLogout}>
          {children}
        </AuthProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
