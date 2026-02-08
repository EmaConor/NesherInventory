"use client";

import { useAuthActions } from "@/utils";
import { IconLogout } from "@tabler/icons-react";

export function SignOutButton() {
  const { signOut, loading, error } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="inline-flex cursor-pointer items-center gap-2 text-red-500 hover:text-red-600 transition-colors font-medium disabled:opacity-50"
      >
        <IconLogout size={18} strokeWidth={1.5} />
        {loading ? "Cerrando sesión..." : "Cerrar Sesión"}
      </button>

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
