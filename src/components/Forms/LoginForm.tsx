"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@/utils";

const loginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});
type FormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { signIn, loading, error } = useAuthActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    await signIn(data.email.toLowerCase(), data.password, "/");
  };

  const getInputClasses = (hasError: boolean) => {
    return `
      w-full px-4 py-3 rounded-xl border bg-card/40 focus:outline-none transition-colors
      ${
        hasError
          ? "border-red-500 focus:border-red-500 text-red-600 placeholder:text-red-300"
          : "border-border focus:border-primary text-foreground"
      }
    `;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Correo Electrónico *
        </label>
        <input
          type="email"
          disabled={loading}
          className={getInputClasses(!!errors.email)}
          placeholder="tu@correo.com"
          autoFocus
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-2 text-xs text-red-500 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Contraseña *
        </label>
        <input
          type="password"
          disabled={loading}
          className={getInputClasses(!!errors.password)}
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-2 text-xs text-red-500 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3.5 rounded-full font-medium transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Cargando..." : "Iniciar sesión"}
      </button>
    </form>
  );
};
