// ProductForm.js
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  useForm,
  FormProvider,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  CloudUpload,
  Close,
} from "@mui/icons-material";
import WatchFields from "./WatchFields";
import ClothFields from "./clothFields";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ProductForm = ({
  initialValues = {},
  onSubmitSuccess,
}) => {
  const navigate = useNavigate();
  const methods = useForm();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = methods;

  const [loading, setLoading] = useState(false);
  const [customCollection, setCustomCollection] =
    useState();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] =
    useState(initialValues?.Imageurl || null);
  const isSale = watch("sale");
  const onSubmit = async (data) => {
    if (!image && !initialValues?.Imageurl) {
      console.error("Error: Image is required");
      return;
    }
    const formData = new FormData();
    formData.append(
      "collection",
      data.collection === "Other"
        ? customCollection
        : data.collection
    );
    if (image) formData.append("image", image);
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("review", data.review);
    formData.append(
      "description",
      data.description
    );

    formData.append(
      "Quantity",
      data.Quantity || 0
    );
    formData.append("weight", data.weight || 0);
    formData.append(
      "isStitching",
      data.isStitching || false
    );

    const materials = Array.isArray(
      data.materials
    )
      ? data.materials.join(",")
      : "";
    formData.append("materials", materials);

    formData.append("size", data.size);

    if (initialValues._id)
      formData.append(
        "stockStatus",
        data.stockStatus
      );
    if (isSale && data.discountPrice)
      formData.append(
        "discountPrice",
        data.discountPrice
      );
    formData.append("sale", isSale);
    formData.append("category", data.category);
    formData.append(
      "subCategory",
      data.subCategory
    );

    formData.append(
      "SelectedCategory",
      data.SelectedCategory
    );

    setLoading(true);
    try {
      await onSubmitSuccess(formData);
      reset();
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error(
        "Error creating product:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        padding: 3,
        width: "100%",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fafafa",
      }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        color="primary"
        align="center">
        {initialValues._id
          ? "Edit Product"
          : "Add Product"}
      </Typography>
      <FormProvider {...methods}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={watch("category")}
                onChange={(e) =>
                  setValue(
                    "category",
                    e.target.value
                  )
                }
                label="Category">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Clothes">
                  Clothes
                </MenuItem>
                <MenuItem value="Watches">
                  Watches
                </MenuItem>
                <MenuItem value="Jackets">
                  Jackets
                </MenuItem>
              </Select>
              {errors.category && (
                <Typography color="error">
                  {errors.category.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {watch("category") === "Watches" && (
            <WatchFields
              sizes={["S", "M", "L", "XL", "XXL"]}
              stock={["In Stock", "Out of Stock"]}
            />
          )}
          {watch("category") === "Clothes" && (
            <ClothFields
              sizes={["S", "M", "L", "XL", "XXL"]}
              stock={["In Stock", "Out of Stock"]}
            />
          )}

          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column">
              {imagePreview ? (
                <Box
                  position="relative"
                  width="100px"
                  height="100px">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor:
                        "rgba(255,255,255,0.7)",
                    }}>
                    <Close color="error" />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <label htmlFor="upload-image">
                    <VisuallyHiddenInput
                      accept="image/*"
                      id="upload-image"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <Button
                      component="span"
                      variant="outlined"
                      color="primary"
                      startIcon={<CloudUpload />}>
                      Upload Image
                    </Button>
                  </label>
                </>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}>
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : initialValues._id ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
};

export default ProductForm;
