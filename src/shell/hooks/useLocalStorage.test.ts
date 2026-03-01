import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReset();
    vi.mocked(localStorage.setItem).mockReset();
  });

  it("returns default value when localStorage is empty", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");
  });

  it("reads initial value from localStorage", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify("stored-value"),
    );

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("stored-value");
  });

  it("writes value to localStorage when updated", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("new-value"),
    );
  });

  it("supports function updater", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(5));

    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(6);
  });

  it("handles invalid JSON in localStorage gracefully", () => {
    vi.mocked(localStorage.getItem).mockReturnValue("not valid json{{{");

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "fallback"),
    );

    expect(result.current[0]).toBe("fallback");
  });

  it("works with object values", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const defaultVal = { theme: "dark", fontSize: 14 };
    const { result } = renderHook(() =>
      useLocalStorage("settings", defaultVal),
    );

    expect(result.current[0]).toEqual(defaultVal);

    act(() => {
      result.current[1]({ theme: "light", fontSize: 16 });
    });

    expect(result.current[0]).toEqual({ theme: "light", fontSize: 16 });
  });

  it("works with boolean values", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(true));

    const { result } = renderHook(() => useLocalStorage("flag", false));

    expect(result.current[0]).toBe(true);
  });
});
