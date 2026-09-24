"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Verifica que exista una sesión activa antes de ejecutar una Server Action.
 *
 * Las Server Actions de Next.js son endpoints HTTP reales: aunque la UI
 * solo las llame desde páginas protegidas, cualquiera que conozca el
 * identificador de la acción puede invocarla directamente saltándose el
 * layout. Por eso la verificación de sesión tiene que vivir aquí, no solo
 * en el layout de la página.
 *
 * Lanza un error si no hay sesión; las actions deben capturarlo en su
 * try/catch existente y devolver `{ ok: false, message: "No autorizado" }`.
 */
export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}
