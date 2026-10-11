import { getCurrentAdmin } from "@/app/lib/admin";

export async function getAdminAccess() {
  const admin = await getCurrentAdmin();

  console.log("Admin authenticated:", Boolean(admin));
  console.log("Admin role:", admin?.role);

  return admin;
}