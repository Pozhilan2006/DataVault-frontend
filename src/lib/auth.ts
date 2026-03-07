import api from "./api";

/** Store JWT in localStorage */
export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

/** Remove JWT from localStorage */
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

/** Read current JWT */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

/** Check if the user is authenticated */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/** Register a new account */
export const register = async (email: string, password: string): Promise<void> => {
  await api.post("/auth/register", { email, password });
};

/** Login and persist the JWT */
export const login = async (email: string, password: string): Promise<void> => {
  const { data } = await api.post<{ accessToken: string }>("/auth/login", {
    email,
    password,
  });
  setToken(data.accessToken);
};

/** Clear session */
export const logout = (): void => {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
