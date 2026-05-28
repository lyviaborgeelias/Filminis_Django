export function saveAuth(access, refresh, user) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.clear();
}