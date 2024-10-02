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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import axios from 'axios';

// Styled component for the file input
const Input = styled('input')({
  display: 'none',
});

const AddProducts = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [image, setImage] = React.useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', data.title);
    formData.append('price', data.price);
    formData.append('review', data.review);
    formData.append('description', data.description);
    formData.append('quantity', data.quantity);
    formData.append('discountPrice', data.discountPrice);
    formData.append('sale', data.sale);
    formData.append('category', data.category);

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error uploading data:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Add Product
      </Typography>

      <TextField
        {...register('title', { required: 'Title is required' })}
        label="Title"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.title}
        helperText={errors.title ? errors.title.message : ''}
      />
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
      <TextField
        {...register('review', { required: 'Review is required', min: 0, max: 5 })}
        label="Review"
        type="number"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.review}
        helperText={errors.review ? 'Review must be between 0 and 5' : ''}
      />
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
      <TextField
        {...register('discountPrice', { required: 'Discount Price is required', valueAsNumber: true })}
        label="Discount Price"
        type="number"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.discountPrice}
        helperText={errors.discountPrice ? errors.discountPrice.message : ''}
      />

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

      <FormControlLabel
        control={
          <Checkbox
            {...register('sale')}
            color="primary"
          />
        }
        label="On Sale"
      />

      <label htmlFor="image-upload">
        <Input
          accept="image/*"
          id="image-upload"
          type="file"
          onChange={handleImageChange}
          required
        />
        <Button variant="contained" component="span" sx={{ marginTop: 2 }}>
          Upload Image
        </Button>
      </label>

      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
        Add Product
      </Button>
    </Box>
  );
};

export default AddProducts;
