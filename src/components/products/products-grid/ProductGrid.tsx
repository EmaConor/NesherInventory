"use client";

import { deleteProduct } from "@/actions";
import { ProductItem } from "../ProductItem";
import { Collection, Color, Product, Size } from "@/interfaces";
import { Modal, ProductForm } from "@/components";
import { useState } from "react";

interface Props {
  products: Product[];
  collections: Collection[];
  colors: Color[];
  sizes: Size[];
}

export const ProductGrid = ({
  products,
  collections,
  colors,
  sizes,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const openModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?",
    );
    if (!confirmed) return;

    try {
      await deleteProduct(id);

      console.log("Eliminando address con ID:", id);
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar la dirección");
    }
  };

  const handleEditProduct = async (product: Product) => {
    openModal(product);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.slug} className="w-full fade-in">
            <ProductItem
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Editar Producto"}
      >
        <ProductForm
          product={editingProduct}
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
