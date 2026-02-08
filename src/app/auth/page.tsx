"use client";

import { LoginForm } from "@/components";


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1
            className="font-serif text-3xl font-semibold tracking-wide text-foreground inline-block mb-4"
          >
            NESHER
          </h1>
          <h1 className="font-serif text-xl text-foreground">Iniciar Sesión</h1>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
