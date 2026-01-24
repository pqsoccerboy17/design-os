import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  AuthProvider,
  useAuth,
  usePermission,
  useRole,
  rolePermissions,
  type AuthUser,
  type Role,
} from "./auth-context";
import { mockUsers } from "@/test/test-utils";

function createWrapper(user: AuthUser | null, onLogout?: () => void) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AuthProvider user={user} onLogout={onLogout}>
        {children}
      </AuthProvider>
    );
  };
}

describe("AuthProvider", () => {
  describe("useAuth hook", () => {
    it("throws error when used outside AuthProvider", () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");
    });

    it("provides user when authenticated", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(mockUsers.admin),
      });

      expect(result.current.user).toEqual(mockUsers.admin);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("provides null user when not authenticated", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(null),
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("calls onLogout when logout is invoked", () => {
      const onLogout = vi.fn();
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(mockUsers.admin, onLogout),
      });

      act(() => {
        result.current.logout();
      });

      expect(onLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("hasPermission", () => {
    it("returns true when user has permission", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(mockUsers.admin),
      });

      expect(result.current.hasPermission("admin:access")).toBe(true);
      expect(result.current.hasPermission("clients:delete")).toBe(true);
    });

    it("returns false when user lacks permission", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(mockUsers.viewer),
      });

      expect(result.current.hasPermission("admin:access")).toBe(false);
      expect(result.current.hasPermission("clients:delete")).toBe(false);
    });

    it("returns false when user is null", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(null),
      });

      expect(result.current.hasPermission("clients:read")).toBe(false);
    });
  });

  describe("hasRole", () => {
    it("returns true when user has exact role", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(mockUsers.manager),
      });

      expect(result.current.hasRole("manager")).toBe(true);
    });

    it("returns true when user has higher role (hierarchy)", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(mockUsers.admin),
      });

      expect(result.current.hasRole("viewer")).toBe(true);
      expect(result.current.hasRole("member")).toBe(true);
      expect(result.current.hasRole("manager")).toBe(true);
      expect(result.current.hasRole("admin")).toBe(true);
    });

    it("returns false when user has lower role", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(mockUsers.member),
      });

      expect(result.current.hasRole("manager")).toBe(false);
      expect(result.current.hasRole("admin")).toBe(false);
    });

    it("returns false when user is null", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(null),
      });

      expect(result.current.hasRole("viewer")).toBe(false);
    });
  });

  describe("permissions array", () => {
    it.each<Role>(["admin", "manager", "member", "viewer"])(
      "provides correct permissions for %s role",
      (role) => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: createWrapper(mockUsers[role]),
        });

        expect(result.current.permissions).toEqual(rolePermissions[role]);
      },
    );

    it("provides empty permissions when user is null", () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(null),
      });

      expect(result.current.permissions).toEqual([]);
    });
  });
});

describe("usePermission hook", () => {
  it("returns true when user has the permission", () => {
    const { result } = renderHook(() => usePermission("clients:read"), {
      wrapper: createWrapper(mockUsers.viewer),
    });

    expect(result.current).toBe(true);
  });

  it("returns false when user lacks the permission", () => {
    const { result } = renderHook(() => usePermission("clients:delete"), {
      wrapper: createWrapper(mockUsers.viewer),
    });

    expect(result.current).toBe(false);
  });
});

describe("useRole hook", () => {
  it("returns true when user has the role or higher", () => {
    const { result } = renderHook(() => useRole("member"), {
      wrapper: createWrapper(mockUsers.admin),
    });

    expect(result.current).toBe(true);
  });

  it("returns false when user has lower role", () => {
    const { result } = renderHook(() => useRole("admin"), {
      wrapper: createWrapper(mockUsers.member),
    });

    expect(result.current).toBe(false);
  });
});
