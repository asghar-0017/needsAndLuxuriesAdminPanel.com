import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Badge,
  Rating,
} from "@mui/material";

const ProductCard = ({ product }) => {
  // Check if product is defined before rendering
  if (!product) {
    return <div>Loading...</div>; // Handle the case where product is undefined
  }

  return (
    <Card sx={{ maxWidth: 345, position: "relative" }}>
      <CardActionArea>
        {/* Product Image */}
        <CardMedia
          component="img"
          height="300"
          image={product.Imageurl}
          alt={product.title}
        />

{/* Badge for discount */}
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
            //   padding: " 12px",
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
            //   padding: " 12px",
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

// Dummy product to pass as props for testing the UI
const product = {
  Imageurl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  title: "Leather Jacket",
  price: "121.80",
  sale: true,
  discount:true,
  review: 2.5
};

// Usage of the ProductCard component
export default function ProductCardWrapper() {
  return <ProductCard product={product} />;
}
