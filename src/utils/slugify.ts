export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/[^a-z0-9\s-]/g, "") // elimina caracteres raros
    .replace(/\s+/g, "-") // espacios a guiones
    .replace(/-+/g, "-"); // guiones duplicados
}
