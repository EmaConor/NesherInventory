"use client";

import { IconPackage, IconPlus } from "@tabler/icons-react";
import { Modal } from "../ui/Modal";
import { useState } from "react";
import { ProductForm } from "../Forms/ProductForm";
import { Collection, Color, Size } from "@/interfaces";

export const EmptyState = ({
  hasFilters,
  colors,
  sizes,
  collections,
}: {
  hasFilters: boolean;
  colors: Color[];
  sizes: Size[];
  collections: Collection[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="p-4 rounded-full bg-muted mb-4">
          <IconPackage size={35} className="text-muted-foreground" />
        </div>

        {hasFilters ? (
          <>
            <h3 className="text-lg font-semibold mb-1">Sin resultados</h3>
            <p className="text-muted-foreground mb-4">
              No se encontraron productos con los filtros aplicados.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-1">No hay productos</h3>
            <p className="text-muted-foreground mb-4">
              Comienza agregando tu primer producto al inventario.
            </p>
            <button
              className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden cursor-pointer justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              onClick={() => openModal()}
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Agregar Producto
            </button>
          </>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Nuevo Producto"}
      >
        <ProductForm
          onSubmit={(data) => {
            console.log(data);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
          colors={colors}
          sizes={sizes}
          collections={collections}
        />
      </Modal>
    </>
  );
};
