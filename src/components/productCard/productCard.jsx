import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Badge,
  Rating,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 345, position: "relative", m: 2 }}>
      <CardActionArea>
        {/* Product Image */}
        <CardMedia
          component="img"
          height="300"
          image={product.Imageurl}
          alt={product.title}
        />

        {/* Badge for Discount */}
        {product.discount && (
          <Badge
            badgeContent={`13%`}
            color="secondary"
            sx={{
              position: "absolute",
              top: 20,
              right: 30,
              backgroundColor: "pink",
              color: "white",
            }}
          />
        )}

        {/* Badge for Sale */}
        {product.sale && (
          <Badge
            badgeContent={`Sale`}
            color="secondary"
            sx={{
              position: "absolute",
              top: 50,
              right: 30,
              backgroundColor: "purple",
              color: "white",
            }}
          />
        )}

        <CardContent sx={{ textAlign: "center" }}>
          {/* Product Title */}
          <Typography gutterBottom variant="h6" component="div">
            {product.title}
          </Typography>

          {/* Product Rating */}
          <Rating value={product.review || 0} readOnly />

          {/* Product Price */}
          <div>
            <Typography variant="h6">{product.price} €</Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// List of dummy products with categories
const products = [
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Leather Jacket",
    price: "121.80",
    sale: true,
    discount: true,
    review: 2.5,
    category: "Clothing",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Summer Dress",
    price: "99.99",
    sale: true,
    discount: true,
    review: 4.0,
    category: "Clothing",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Sneakers",
    price: "59.99",
    sale: false,
    discount: false,
    review: 3.5,
    category: "Footwear",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Winter Coat",
    price: "150.00",
    sale: true,
    discount: true,
    review: 4.5,
    category: "Clothing",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Sunglasses",
    price: "25.00",
    sale: false,
    discount: false,
    review: 4.0,
    category: "Accessories",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Hat",
    price: "20.00",
    sale: false,
    discount: false,
    review: 4.2,
    category: "Accessories",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Running Shoes",
    price: "80.00",
    sale: true,
    discount: true,
    review: 3.8,
    category: "Footwear",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Denim Jacket",
    price: "110.00",
    sale: true,
    discount: true,
    review: 4.6,
    category: "Clothing",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Casual Shirt",
    price: "35.00",
    sale: false,
    discount: false,
    review: 3.0,
    category: "Clothing",
  },
  {
    Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    title: "Formal Suit",
    price: "250.00",
    sale: true,
    discount: true,
    review: 4.9,
    category: "Clothing",
  },
];

// Usage of the ProductCard component with responsive Grid layout and category filter
export default function ProductCardWrapper() {
  const [category, setCategory] = useState("All");

  // Handle category change
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Filter products by category
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <div>
      {/* Category Dropdown */}
      <FormControl sx={{ m: 2, minWidth: 180 }}>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={handleCategoryChange} label="Category">
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Clothing">Clothing</MenuItem>
          <MenuItem value="Footwear">Footwear</MenuItem>
          <MenuItem value="Accessories">Accessories</MenuItem>
        </Select>
      </FormControl>

      {/* Products Grid */}
      <Grid container spacing={2} justifyContent="center">
        {filteredProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ProductCard product={product}/>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
