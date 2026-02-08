"use client";

import { currencyFormat } from "@/utils";
import { Product } from "@/interfaces";
import Image from "next/image";
import { IconAlertTriangle, IconEdit, IconTrash } from "@tabler/icons-react";

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductItem = ({ product, onDelete, onEdit }: Props) => {
  const profit = Number(product.salePrice) - Number(product.supplierPrice);
  const profitPercentage = (
    (profit / Number(product.supplierPrice)) *
    100
  ).toFixed(0);

  const getStockStatus = () => {
    if (product.stock === 0) return { label: "Agotado", class: "status-out" };
    if (product.stock < 5) return { label: "Bajo stock", class: "status-low" };
    return { label: "Disponible", class: "status-ok" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-64">
        <Image
          src={product.imageUrl || "/img/placeholder-image.png"}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          alt={product.name || "Product image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/img/placeholder-image.png";
          }}
        />
        <div className="absolute top-2 right-2 inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs">
          {product.size.label}
        </div>
        <div
          className={`absolute top-2 left-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-secondary hover:bg-primary/80 ${stockStatus.class}`}
        >
          {product.stock === 0 && (
            <IconAlertTriangle className="h-3 w-3 mr-1" />
          )}
          {stockStatus.label}
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-transparent to-transparent lg:opacity-0 lg:group-hover:opacity-100 opacity-100 lg:transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 flex-1"
              onClick={() => onEdit(product)}
            >
              <IconEdit size={24} className="" />
              Editar
            </button>

            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-3 bg-destructive text-destructive-foreground hover:bg-destructive/80"
              onClick={() => onDelete(product.id)}
            >
              <IconTrash size={24} className="" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full border"
                style={{
                  backgroundColor: product.color.hex,
                  borderColor: "#000000",
                }}
              />
              {product.color.color}
            </span>
            <span>•</span>
            <span>{product.stock} uds</span>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-lg font-bold">
                {currencyFormat(product.salePrice)}
              </p>
              <p className="text-xs text-muted-foreground">
                Costo: {currencyFormat(product.supplierPrice)}
              </p>
            </div>

            <div
              className={`text-xs border px-2 py-1 rounded ${
                profit > 0
                  ? "text-success border-success/30 bg-success/10"
                  : profit < 0
                    ? "text-destructive border-destructive/30 bg-destructive/10"
                    : "text-muted-foreground border-muted/30 bg-muted/10"
              }`}
            >
              {profit > 0 ? "+" : profit < 0 ? "-" : ""}
              {profitPercentage}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
