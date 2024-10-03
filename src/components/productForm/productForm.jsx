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
  FormControlLabel,
  Checkbox,
  Grid,
  IconButton,
  FormGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { deleteDataById } from "../../config/apiServices/apiServices";
import { showSuccessToast } from "../toast/toast";
import { useNavigate } from "react-router-dom";

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

const ProductForm = ({ initialValues = {}, onSubmitSuccess }) => {
    let navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      ...initialValues,
      discountPrice: initialValues.discountprice || "",
      sale: initialValues.discountprice ? true : false,
      stockStatus: initialValues.stockStatus || "",
    },
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialValues?.Imageurl || null
  );
  const isSale = watch("sale");

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const stock = ["In Stock", "Out of Stock"];
  const materials = ["Polyester", "Cotton", "Silk", "Wool"];

  const onSubmit = async (data) => {
    if (!image && !initialValues?.Imageurl) {
      console.error("Error: Image is required");
      return;
    }
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("review", data.review);
    formData.append("description", data.description);
    formData.append("Quantity", data.Quantity);
    formData.append("weight", data.weight);
    formData.append("materials", data.materials.join(","));
    formData.append("size", data.size);
    formData.append("stockStatus", data.stockStatus);

    if (isSale && data.discountPrice) {
      formData.append("discountprice", data.discountPrice);
    }

    formData.append("sale", isSale);
    formData.append("category", data.category);

    try {
      await onSubmitSuccess(formData);
      reset();
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleDiscountPriceChange = (event) => {
    const value = Number(event.target.value);
    setValue("discountPrice", Math.min(Math.max(value, 0), 100));
  };

  const handleReviewChange = (event) => {
    const value = Number(event.target.value);
    setValue("review", Math.min(Math.max(value, 0), 5));
  };

  const handleMaterialChange = (event) => {
    const { value, checked } = event.target;
    const currentMaterials = watch("materials") || [];

    if (checked) {
      setValue("materials", [...currentMaterials, value]);
    } else {
      setValue(
        "materials",
        currentMaterials.filter((material) => material !== value)
      );
    }
  };

  const handleDelete = async () => {
    try {
      let response = await deleteDataById("product-delete", initialValues._id);
      console.log(response);
      showSuccessToast("Product deleted successfully.");
      navigate(-1)
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        margin: "0 auto",
        padding: 2,
        width: "100%",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h4" fontWeight={"bold"} gutterBottom align="center">
        {initialValues._id ? "Edit Product" : "Add Product"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            {...register("title", { required: "Title is required" })}
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
            })}
            label="Price"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.price}
            helperText={errors.price ? errors.price.message : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register("review", { required: "Review is required" })}
            label="Review"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleReviewChange}
            error={!!errors.review}
            helperText={errors.review ? "Review must be between 0 and 5" : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register("Quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
            })}
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.Quantity}
            helperText={errors.Quantity ? errors.Quantity.message : ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl margin="normal" fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              {...register("category", { required: "Category is required" })}
              labelId="category-label"
              defaultValue={initialValues.category || ""}
              error={!!errors.category}
              onChange={(event) => {
                setValue("category", event.target.value);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="dresses">Dresses</MenuItem>
              <MenuItem value="tops">Tops</MenuItem>
              <MenuItem value="skirts">Skirts</MenuItem>
              <MenuItem value="pants">Pants</MenuItem>
              <MenuItem value="jackets">Jackets</MenuItem>
            </Select>
            {errors.category && (
              <Typography color="error">{errors.category.message}</Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register("weight", {
              required: "Weight is required",
              valueAsNumber: true,
            })}
            label="Weight (kg)"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.weight}
            helperText={errors.weight ? errors.weight.message : ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl margin="normal" fullWidth>
            <InputLabel id="size-label">Size</InputLabel>
            <Select
              {...register("size", { required: "Size is required" })}
              labelId="size-label"
              defaultValue={initialValues.size || ""}
              error={!!errors.size}
              onChange={(event) => {
                setValue("size", event.target.value);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
            {errors.size && (
              <Typography color="error">{errors.size.message}</Typography>
            )}
          </FormControl>
        </Grid>

        {initialValues._id && (
          <Grid item xs={12} md={6}>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="stock-label">Stock</InputLabel>
              <Select
                {...register("stockStatus")}
                labelId="stock-label"
                defaultValue={initialValues.stockStatus || ""}
                error={!!errors.stockStatus}
                onChange={(event) => {
                  setValue("stock", event.target.value);
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {stock.map((stock) => (
                  <MenuItem key={stock} value={stock}>
                    {stock}
                  </MenuItem>
                ))}
              </Select>
              {errors.stock && (
                <Typography color="error">{errors.stock.message}</Typography>
              )}
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <FormGroup>
            <Typography variant="h6">Materials</Typography>
            {materials.map((material) => (
              <FormControlLabel
                key={material}
                control={
                  <Checkbox
                    {...register("materials")}
                    value={material}
                    checked={watch("materials")?.includes(material) || false}
                    onChange={handleMaterialChange}
                  />
                }
                label={material}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>

      <TextField
        {...register("description", { required: "Description is required" })}
        label="Additional Information"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        error={!!errors.description}
        helperText={errors.description ? errors.description.message : ""}
      />

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Checkbox
              {...register("sale")}
              color="primary"
              checked={isSale}
              onChange={(event) => {
                const checked = event.target.checked;
                if (checked && initialValues.discountprice) {
                  setValue("discountPrice", initialValues.discountprice);
                } else {
                  setValue("discountPrice", "");
                }
                setValue("sale", checked);
              }}
            />
          }
          label="Is On Sale?"
        />
      </Grid>

      {isSale && (
        <Grid item xs={12} md={12}>
          <TextField
            {...register("discountPrice")}
            label="Discount Percentage"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleDiscountPriceChange}
            error={!!errors.discountPrice}
            helperText={
              errors.discountPrice ? errors.discountPrice.message : ""
            }
            inputProps={{
              min: 0,
              max: 100,
            }}
          />
        </Grid>
      )}

      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ marginTop: 2, width: "100%" }}
        disabled={!!image}
      >
        Upload Image
        <VisuallyHiddenInput
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
      </Button>

      {imagePreview && (
        <Box
          sx={{
            position: "relative",
            mt: 2,
            maxWidth: "100%",
            height: "auto",
            display: "block",
            mx: "auto",
          }}
        >
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                background: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={imagePreview}
            alt="Image Preview"
            sx={{
              maxWidth: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        {initialValues._id && (
          <Button onClick={()=>handleDelete()} variant="contained" color="error">
            Delete
          </Button>
        )}
        <Button type="submit" variant="contained" color="primary" style={{marginLeft: "10px"}}>
          {initialValues._id ? "Update Product" : "Add Product"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
