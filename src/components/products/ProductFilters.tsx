"use client";

import { Collection, Color, Size } from "@/interfaces";
import { IconPalette, IconRuler, IconSearch, IconX } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  colors: Color[];
  sizes: Size[];
  collections: Collection[];
}

export const ProductFilters = ({ colors, sizes, collections }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([_, value]) => value && value !== "all",
  );

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    return params.toString();
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  }, 300);

  // Handler para limpiar filtros
  const handleClearFilters = () => {
    setSearch('')
    router.push("?");
  };

  return (
    <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="relative w-full sm:flex-1">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar Producto..."
          className="w-full pl-9 px-4 py-3 rounded-xl border bg-background focus:outline-none focus:border-primary"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>

      <div className="flex flex-row gap-2">
        <label className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
          Color:
        </label>
        <select
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border bg-background"

          value={searchParams.get("color") || "all"}
          onChange={(e) => {
            router.push(`?${createQueryString("color", e.target.value)}`);
          }}
        >
          <option value="all">Todos</option>
          {colors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.color}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row gap-2">
        <label className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
          Talla:
        </label>
        <select
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border bg-background"
          value={searchParams.get("size") || "all"}
          onChange={(e) => {
            router.push(`?${createQueryString("size", e.target.value)}`);
          }}
        >
          <option value="all">Todos</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.id}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row gap-2">
        <label className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
          Categoría:
        </label>
        <select
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border bg-background"
          value={searchParams.get("category") || "all"}
          onChange={(e) => {
            router.push(`?${createQueryString("category", e.target.value)}`);
          }}
        >
          <option value="all">Todos</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row gap-2">
        <label className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
          Stock:
        </label>
        <select
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border bg-background"
          value={searchParams.get("stock") || "all"}
          onChange={(e) => {
            router.push(`?${createQueryString("stock", e.target.value)}`);
          }}
        >
          <option value="all">Todos</option>
          <option value="in-stock">Disponible</option>
          <option value="low-stock">Bajo stock</option>
          <option value="out-of-stock">Agotado</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="
            w-full sm:w-auto
            px-4 py-2.5
            rounded-xl border border-border
            hover:bg-muted transition
            flex items-center justify-center
          "
          title="Limpiar filtros"
        >
          <IconX />
        </button>
      )}
    </div>
  );
};
