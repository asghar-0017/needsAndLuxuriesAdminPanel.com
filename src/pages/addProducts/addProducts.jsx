import React from "react";
import ProductForm from "../../components/productForm/productForm";
import { postData } from "../../config/apiServices/apiServices"; 
import { showSuccessToast } from "../../components/toast/toast";

const AddProductPage = () => {
  const handleAddProduct = async (data) => {
    try {
      await postData("create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showSuccessToast("Product added successfully.");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return <ProductForm onSubmitSuccess={handleAddProduct} />;
};

export default AddProductPage;
