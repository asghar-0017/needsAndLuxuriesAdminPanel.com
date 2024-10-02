import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Badge,
  Rating,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PropTypes from "prop-types";

const ProductCard = ({ product, currency }) => {
  const [modalShow, setModalShow] = useState(false);

  const discountedPrice = product.discountprice;
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = discountedPrice
    ? +(discountedPrice * currency.currencyRate).toFixed(2)
    : null;

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

        {/* Badge for Sale and Discount */}
        {product.sale && (
          <Badge
            badgeContent={`-${product.discount}%`}
            color="primary"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "purple",
              color: "white",
              padding: "4px 8px",
            }}
          >
            <Typography variant="button" color="white">
              Sale
            </Typography>
          </Badge>
        )}

        <CardContent sx={{ textAlign: "center" }}>
          {/* Product Title */}
          <Typography gutterBottom variant="h6" component="div">
            {product.title}
          </Typography>

          {/* Product Rating */}
          {product.review && product.review > 0 ? (
            <Rating value={product.review} readOnly />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No reviews yet
            </Typography>
          )}

          {/* Product Price */}
          <div>
            {finalDiscountedPrice !== null ? (
              <Typography variant="h6" color="primary">
                {currency.currencySymbol + finalDiscountedPrice}{" "}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  {currency.currencySymbol + finalProductPrice}
                </Typography>
              </Typography>
            ) : (
              <Typography variant="h6">
                {currency.currencySymbol + finalProductPrice}
              </Typography>
            )}
          </div>
        </CardContent>
      </CardActionArea>

      {/* Action buttons */}
      <CardActions sx={{ justifyContent: "center" }}>
        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon />}
        >
          Add to Cart
        </Button>
        <IconButton onClick={() => setModalShow(true)}>
          <VisibilityIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    Imageurl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discountprice: PropTypes.number,
    review: PropTypes.number,
    sale: PropTypes.bool,
  }).isRequired,
  currency: PropTypes.shape({
    currencyRate: PropTypes.number.isRequired,
    currencySymbol: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
