//tecnically login and register api but i put it here because its user related
//dont know if it'll actually be used but i put it here for now
import { apiFetch } from "../lib/API";

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ token: string }> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export interface SessionUser {
  sub: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  user: SessionUser;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function updateRacha(id: string) {
  return apiFetch(`/users/${id}`, {
    method: "PATCH",
  });
}
