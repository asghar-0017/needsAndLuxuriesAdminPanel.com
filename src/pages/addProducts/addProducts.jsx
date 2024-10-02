import React from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close'; 
import { postData } from '../../config/apiServices/apiServices';
import { showSuccessToast } from '../../components/toast/toast';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AddProducts = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [image, setImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const isSale = watch('sale'); 

  const onSubmit = async (data) => {
    const requestData = {
      image,
      title: data.title,
      price: data.price,
      review: data.review,
      description: data.description,
      quantity: data.quantity,
      discountPrice: isSale ? data.discountPrice : null, 
      sale: isSale,
      category: data.category,
    };

    try {
      const response = await postData("create", requestData);
      console.log('Response:', response);
      showSuccessToast("Product uploaded successfully.")
    } catch (error) {
      console.error('Error uploading data:', error);
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
      setValue('discountPrice', 0); 
    } else if (value > 100) {
      setValue('discountPrice', 100); 
    } else {
      setValue('discountPrice', value); 
    }
  };

  const handleReviewChange = (event) => {
    const value = Number(event.target.value); 
    if (value < 0) {
      setValue('review', 0); 
    } else if (value > 5) {
      setValue('review', 5); 
    } else {
      setValue('review', value); 
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        margin: '0 auto',
        padding: 2,
        width: "100%",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Add Products
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('title', { required: 'Title is required' })}
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('price', { required: 'Price is required', valueAsNumber: true })}
            label="Price"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.price}
            helperText={errors.price ? errors.price.message : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('review', { required: 'Review is required' })}
            label="Review"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleReviewChange} 
            error={!!errors.review}
            helperText={errors.review ? 'Review must be between 0 and 5' : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('quantity', { required: 'Quantity is required', valueAsNumber: true })}
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.quantity}
            helperText={errors.quantity ? errors.quantity.message : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl margin="normal" fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              {...register('category', { required: 'Category is required' })}
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
            {errors.category && <Typography color="error">{errors.category.message}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} style={{ marginLeft: "10px" }}>
          <FormControlLabel
            control={
              <Checkbox
                {...register('sale')}
                color="primary"
              />
            }
            label="On Sale"
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
              helperText={errors.discountPrice ? errors.discountPrice.message : ''}
              inputProps={{
                min: 0,
                max: 100,
              }}
            />
          </Grid>
        )}
      </Grid>

      <TextField
        {...register('description', { required: 'Description is required' })}
        label="Description"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        error={!!errors.description}
        helperText={errors.description ? errors.description.message : ''}
      />

      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ marginTop: 2, width: '100%' }}
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
            position: 'relative',
            mt: 2,
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            mx: 'auto',
          }}
        >
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 1)',
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
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Add Product
        </Button>
      </Box>
    </Box>
  );
};

export default AddProducts;
