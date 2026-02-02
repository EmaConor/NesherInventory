import { IconPlus, IconShoppingBag } from "@tabler/icons-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm supports-backdrop-filter:bg-card/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
              <IconShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Inventario Pro
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block animate-in fade-in slide-in-from-left-2 duration-500">
                Sistema de Gestión Inteligente
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-primary to-primary/90 text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent" />

              <IconPlus className="h-4.5 w-4.5 transition-transform group-hover:rotate-90 duration-300" />
              <span className="hidden sm:inline">Nuevo Producto</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
