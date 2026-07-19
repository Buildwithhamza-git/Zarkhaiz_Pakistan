import React, { useState } from "react";
import { PackageX, Plus } from "lucide-react";

import Button from "../../../shared/components/ui/button";
import Modal from "../../../shared/components/ui/Modal";
import Toast from "../../../shared/components/ui/Toast";
import ProductForm from "../../../shared/components/products/ProductForm";
import ProductCard from "../../../shared/components/products/ProductCard";
import { useProductsContext } from "../../../context/productsContext";

const ProductsPage = () => {
  const { products, addProduct, deleteProduct } = useProductsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAdd = (product) => {
    addProduct(product);
    setIsModalOpen(false);
    setShowToast(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">
            Manage your store's product listings.
          </p>
        </div>

        <Button
          variant="success"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <PackageX size={40} className="mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Products Not Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => {}}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm onSubmit={handleAdd} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Toast
        show={showToast}
        message="Your product has been added successfully"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ProductsPage;