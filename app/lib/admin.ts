import { getCurrentUser } from "@/app/lib/current-user";

export async function getCurrentAdmin() {
  const user = await getCurrentUser();

  console.log("Current user:", user);
  console.log("Current user role:", user?.role);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}