import React, { useEffect, useState } from "react";
import { PackageX, Plus } from "lucide-react";

import Button from "../../../../shared/components/ui/button";
import Modal from "../../../../shared/components/ui/Modal";
import Toast from "../../../../shared/components/ui/Toast";
import DeleteProductModal from "../../../../shared/components/ui/Deleteproductmodal";

import ProductForm from "./ProductForm";
import ProductCard from "./ProductCard";

import {
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/sellerproductApi";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  // =============================
  // Load Products
  // =============================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await getSellerProducts();

      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", 
  });

  loadProducts();
}, []);


  const handleAdd = async (formData) => {
    try {
      await createProduct(formData);

      setIsModalOpen(false);

      await loadProducts();

      setToast({
        show: true,
        message: "Product added successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // Update Product
  // =============================

  const handleUpdate = async (formData) => {
    try {
      await updateProduct(
        editingProduct._id,
        formData
      );

      setEditingProduct(null);

      setIsModalOpen(false);

      await loadProducts();

      setToast({
        show: true,
        message: "Product updated successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // Delete Product
  // =============================

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);

      setDeleteModalOpen(false);

      setSelectedProduct(null);

      await loadProducts();

      setToast({
        show: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Products
          </h1>

          <p className="text-sm text-gray-500">
            Manage your products.
          </p>
        </div>

        <Button
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      {/* Products */}

      {loading ? (
        <div className="py-20 text-center">
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20">
          <PackageX
            size={40}
            className="mb-3 text-gray-300"
          />

          <p>No Products Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsModalOpen(true);
              }}
              onDelete={(product) => {
                setSelectedProduct(product);
                setDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setEditingProduct(null);
          setIsModalOpen(false);
        }}
        title={
          editingProduct
            ? "Edit Product"
            : "Add Product"
        }
      >
        <ProductForm
          product={editingProduct}
          onSubmit={
            editingProduct
              ? handleUpdate
              : handleAdd
          }
          onCancel={() => {
            setEditingProduct(null);
            setIsModalOpen(false);
          }}
        />
      </Modal>

      {/* Delete Modal */}

      <DeleteProductModal
        open={deleteModalOpen}
        product={selectedProduct}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDelete}
      />

      {/* Toast */}

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() =>
          setToast({
            show: false,
            message: "",
          })
        }
      />
    </div>
  );
};

export default ProductsPage;