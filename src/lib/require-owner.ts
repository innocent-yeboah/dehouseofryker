import { ownerSessionValid } from "@/lib/owner-session";
import { redirect } from "next/navigation";

export async function requireOwner(): Promise<void> {
  if (!(await ownerSessionValid())) {
    redirect("/admin/login");
  }
}
