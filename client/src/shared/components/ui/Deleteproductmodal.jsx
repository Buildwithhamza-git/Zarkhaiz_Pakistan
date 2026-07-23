import React from "react";
import Modal from "../../../shared/components/ui/Modal";
import Button from "../../../shared/components/ui/button";

const DeleteProductModal = ({
  open,
  product,
  onClose,
  onConfirm,
}) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Delete Product"
    >
      <div className="space-y-5">

        <p className="text-gray-600">
          Are you sure you want to delete
          <span className="font-semibold">
            {" "}
            {product.name}
          </span>
          ?
        </p>

        <p className="text-sm text-red-500">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">

          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              onConfirm(product._id)
            }
          >
            Delete
          </Button>

        </div>

      </div>
    </Modal>
  );
};

export default DeleteProductModal;