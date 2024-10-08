import React, {
  useContext,
  useEffect,
  useState,
} from "react";
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
  CircularProgress,
} from "@mui/material";
import { fetchData } from "../../config/apiServices/apiServices";
import Loader from "../loader/loader";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/context";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/edit-product/${product._id}`, {
      state: product,
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 500,
        position: "relative",
        m: 0,
      }}
      onClick={handleClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="300"
          image={product.Imageurl}
          alt={product.title}
          loading="lazy"
        />
        {product.discountprice && (
          <Badge
            badgeContent={`${product.discountprice}%`}
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
          <Typography
            gutterBottom
            variant="h6"
            component="div">
            {product.title}
          </Typography>
          <Rating
            value={product.review || 0}
            readOnly
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Typography
              variant="h6"
              sx={{ marginRight: 1 }}>
              {product.newprice
                ? `${product.newprice} €`
                : `${product.price} €`}
            </Typography>
            {product.newprice && (
              <Typography
                variant="h6"
                sx={{
                  color: "gray",
                  textDecoration: "line-through",
                }}>
                {product.price} €
              </Typography>
            )}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default function ProductCardWrapper() {
  const [category, setCategory] = useState("All");
  const [stock, setStock] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] =
  useState([]);
  const { searchQuery } = useContext(
    SearchContext
  );

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleStockChange = (event) => {
    setStock(event.target.value);
  };

  useEffect(() => {
    if (products.length === 0) {
      setFilteredData([]); 
      return;
    }
  
    const filteredProducts = products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
  
      const stockMatch = stock === "All" || product.stockStatus === stock;
  
      let orderIdMatch = true; 
      if (searchQuery) {
        orderIdMatch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
      }
  
      return categoryMatch && stockMatch && orderIdMatch;
    });
  
    setFilteredData(filteredProducts);
    console.log(filteredProducts);
  
  }, [category, stock, searchQuery, products]);
  
  
  

  // const filteredProducts = products.filter(
  //   (product) => {
  //     const categoryMatch =
  //       category === "All" ||
  //       product.category === category;
  //     const stockMatch =
  //       stock === "All" ||
  //       product.stockStatus === stock;
  //     return categoryMatch && stockMatch;
  //   }
  // );

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          "get-product"
        );
        setProducts(response.data);
        setFilteredData(response.data)
      } catch (error) {
        setError(error.message);
        console.error(
          "Error fetching data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  return (
    <div>
      {loading && <Loader open={loading} />}
      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <>
          <FormControl
            sx={{ m: 2, minWidth: 180 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={handleCategoryChange}
              label="Category">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="dresses">
                Dresses
              </MenuItem>
              <MenuItem value="tops">
                Tops
              </MenuItem>
              <MenuItem value="skirts">
                Skirts
              </MenuItem>
              <MenuItem value="pants">
                Pants
              </MenuItem>
              <MenuItem value="jackets">
                Jackets
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            sx={{ m: 2, minWidth: 180 }}>
            <InputLabel>Stock</InputLabel>
            <Select
              value={stock}
              onChange={handleStockChange}
              label="Stock">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="In Stock">
                In Stock
              </MenuItem>
              <MenuItem value="Out of Stock">
                Out of Stock
              </MenuItem>
            </Select>
          </FormControl>

          <Grid
            container
            spacing={4}
            justifyContent="center">
            {filteredData.length > 0 ? (
              filteredData.map(
                (product, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    key={index}>
                    <ProductCard
                      product={product}
                    />
                  </Grid>
                )
              )
            ) : (
              <Typography variant="h6">
                No products found.
              </Typography>
            )}
          </Grid>
        </>
      )}
    </div>
  );
}
