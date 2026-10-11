
import { getAdminAccess } from "./getAdmin";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const admin = await getAdminAccess();

  console.log("Navbar admin:", admin);

  return <NavbarClient isAdmin={Boolean(admin)} />;
}
