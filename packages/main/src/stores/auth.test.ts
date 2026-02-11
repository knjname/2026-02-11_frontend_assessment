import { authStore, setAuth, clearAuth } from "./auth";

describe("authStore", () => {
  beforeEach(() => {
    clearAuth();
  });

  it("should start unauthenticated", () => {
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
  });

  it("should set auth state on login", () => {
    const user = {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      role: "admin" as const,
      displayName: "管理者",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    };
    setAuth(user, "mock-token-1");

    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toEqual(user);
    expect(authStore.token).toBe("mock-token-1");
  });

  it("should clear auth state on logout", () => {
    setAuth(
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        displayName: "管理者",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      },
      "mock-token-1",
    );
    clearAuth();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
  });
});
