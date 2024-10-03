import React from "react";
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
import { postData } from "../../config/apiServices/apiServices";
import { showSuccessToast } from "../../components/toast/toast";

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

const AddProducts = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const [image, setImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const isSale = watch("sale");

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const materials = ["Polyester", "Cotton", "Silk", "Wool"];

  const onSubmit = async (data) => {
    if (!image) {
      console.error("Error: Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("review", data.review);
    formData.append("description", data.description);
    formData.append("quantity", data.quantity);
    formData.append("weight", data.weight);
    formData.append("materials", data.materials.join(","));
    formData.append("size", data.size); 

    if (
      isSale &&
      data.discountPrice !== undefined &&
      data.discountPrice !== null
    ) {
      formData.append("discountprice", data.discountPrice);
    }

    formData.append("sale", isSale);
    formData.append("category", data.category);

    try {
      const response = await postData("create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showSuccessToast("Product added successfully.");
      reset({
        title: "",
        price: "",
        review: "",
        quantity: "",
        weight: "",
        category: "",
        size: "",
        description: "",
        sale: false,
        discountPrice: "",
        materials: [],
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding product:", error);
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
    if (value < 0) {
      setValue("discountPrice", 0);
    } else if (value > 100) {
      setValue("discountPrice", 100);
    } else {
      setValue("discountPrice", value);
    }
  };

  const handleReviewChange = (event) => {
    const value = Number(event.target.value);
    if (value < 0) {
      setValue("review", 0);
    } else if (value > 5) {
      setValue("review", 5);
    } else {
      setValue("review", value);
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
        Add Products
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
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
            })}
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.quantity}
            helperText={errors.quantity ? errors.quantity.message : ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl margin="normal" fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              {...register("category", { required: "Category is required" })}
              labelId="category-label"
              defaultValue=""
              error={!!errors.category}
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
              defaultValue=""
              error={!!errors.size}
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

        <Grid item xs={12} md={6}>
          <FormGroup>
            <Typography variant="h6">Materials</Typography>
            {materials.map((material) => (
              <FormControlLabel
                key={material}
                control={
                  <Checkbox {...register("materials")} value={material} />
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
          control={<Checkbox {...register("sale")} color="primary" />}
          label="Is On Sale?"
        />
      </Grid>

      {isSale && (
        <Grid item xs={12} md={12}>
          <TextField
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
        <Button type="submit" variant="contained" color="primary">
          Add Product
        </Button>
      </Box>
    </Box>
  );
};

export default AddProducts;
