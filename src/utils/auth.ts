"use client";

// hooks/use-auth-actions.ts
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    callbackURL: string,
  ) => {
    setLoading(true);
    resetState();

    const { error } = await authClient.signUp.email(
      { email, password, name, callbackURL },
      // {
      //   onRequest: () => {
      //     setLoading(true);
      //     setError(null);
      //   },
      //   onSuccess: () => {
      //     setLoading(false);
      //     router.push(callbackURL);
      //     router.refresh();
      //   },
      //   onError: (ctx) => {
      //     setLoading(false);
      //     setError(ctx.error.message);
      //   },
      // },
    );

    setLoading(false);

    if (error) {
      if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
        setError("El correo ya está en uso. Intenta con otro.");
      } else {
        setError(error.message ?? "Error al registrarse.");
      }
      return false;
    }

    setSuccess(true);
    router.push(callbackURL);
    router.refresh();
    return true;
  };

  const signIn = async (
    email: string,
    password: string,
    callbackURL: string,
  ) => {
    setLoading(true);
    resetState();

    const { error } = await authClient.signIn.email(
      { email, password, callbackURL },
      // {
      //   onRequest: () => {
      //     setLoading(true);
      //     setError(null);
      //   },
      //   onSuccess: () => {
      //     setLoading(false);
      //     router.push(callbackURL);
      //     router.refresh();
      //   },
      //   onError: (ctx) => {
      //     setLoading(false);
      //     setError(ctx.error.message);
      //   },
      // },
    );

    setLoading(false);

    if (error) {
      setError(error.code === "INVALID_EMAIL_OR_PASSWORD"
        ? "Email o contraseña inválidos."
        : error.message ?? "Error al iniciar sesión."
      );
      return false;
    }

    setSuccess(true);
    router.push(callbackURL);
    router.refresh();
    return true;
  };

  const changePassword = async (
    newPassword: string,
    currentPassword: string,
  ) => {
    setLoading(true);
    resetState();

    const { error } = await authClient.changePassword({
      newPassword, // required
      currentPassword, // required
      revokeOtherSessions: true,
    });

    setLoading(false);

    if (error) {
      if (error?.code === "INVALID_PASSWORD") {
        setError("La contraseña actual es incorrecta.");
        return false;
      }
      setError(error.message ?? "Error al cambiar contraseña.");
      return false;
    }

    setSuccess(true);
    return true;
  };

  const signOut = async () => {
    setLoading(true);
    resetState();

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh(); // Limpia el caché de las rutas protegidas
          },
        },
      });

    } catch {
      setError("No se pudo cerrar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return { signUp, signIn, signOut, changePassword, loading, error, success };
};
