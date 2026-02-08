export interface Collection {
  id: number;
  name: string;
  slug: string;
}

export interface InputCollection {
  name: string;
  slug: string;
}


export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;

  stock: number;
  supplierPrice: number;
  salePrice: number;

  // Relaciones
  color: Color;
  size: Size;
  collection: Collection;
}

export interface InputProduct {
  id?: string;
  name: string;
  description?: string | null;
  image?: File | null;
  imageChanged: boolean
  
  stock: number;
  supplierPrice: number;
  salePrice: number;

  // Relaciones
  color: Color;
  size: Size;
  collection: Collection;
}

export interface InputColor {
  color: string;
  hex: string;
}

export interface Color {
  id: number;
  color: string;
  hex: string;
}

export interface InputSize {
  label: string;
}

export interface Size {
  id: number;
  label: string;
}
