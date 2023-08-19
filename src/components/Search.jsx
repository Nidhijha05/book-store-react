import React, { useState } from "react";
import { TextField, Button, List, ListItemButton, ListItemText, Collapse, ListItem } from "@mui/material";
//import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import '../pages/Search.css';
import bookService from "../service/bookService";
import { useAuthContext } from "../context/auth";
import { useCartContext } from "../context/cart";
import shared from "../utils/shared";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
//import { useState } from "react"

function Search() {

    const [query, setQuery] = useState("");
    const [bookList, setBooklist] = useState([]);
    const [openSearchResult, setOpenSearchResult] = useState(false);
    const [open, setOpen] = useState(true);
    const handleClick = () => {
        setOpen(!open);
    }

    const searchBook = async () => {
        const res = await bookService.searchBook(query);
        setBooklist(res);
    }

    const search = () => {
        searchBook();
        setOpenSearchResult(true);
    }

    const navigate = useNavigate();
    const authContext = useAuthContext();
  const cartContext = useCartContext();
  const addToCart = (book) => {
    if (!authContext.user.id) {
      navigate("/login");
      toast.error("Please login before adding books to cart",{theme:"colored"});
    } else {
      shared
        .addToCart(book, authContext.user.id)
        .then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success("Item added in cart",{theme:"colored"});
            cartContext.updateCart();
          }
        })
        .catch((err) => {
          toast.warning(err,{theme:"colored"});
        });
    }
  };

    return (

        <div className="imp">
            <div style={{  }}>
                <TextField
                    hiddenLabel
                    label="Search here"
                    type="text"
                    value={query}
                    variant="outlined"
                    size="small"
                    sx={{
                        width: "550px",
                        backgroundColor: "white",
                        fontStyle: "italic",
                        "&.MuiInputBase-input": {
                            fontStyle: "normal",
                        }
                    }}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }} />
                    
                {openSearchResult && (
                    <div className="one" ><div className="one-no">{bookList?.length === 0 && (<p className="one-not">No product found</p>)}</div>
                    

                        <List className="h-related-list">
                            {bookList?.length > 0 &&
                                bookList.map((item, index) => (<ListItem><ListItemButton onClick={handleClick} className="imp-1" sx={{
                                    backgroundColor: "whitesmoke",
                                }} key={index}><ListItemText primary={item.name} secondary={item.description} sx={{ width: 320 }} />
                                    {open ? <ArrowBackIosIcon fontSize="small" /> : <ArrowForwardIosIcon fontSize="small"/>}</ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit ><List component="div" disablePadding>
                                        <ListItemButton sx={{ pl: -4 }}><span>Rs {item.price}/-</span><ListItemButton  onClick={()=>addToCart(item)} sx={{ color: "red" }} variant="text">Add To Cart</ListItemButton>
                                        </ListItemButton>

                                    </List></Collapse>

                                </ListItem>

                                ))
                            }
                        </List></div>
                )}

            </div>

            <Button variant="contained"
                startIcon={<AiOutlineSearch />}
                sx={{
                    color: "white",
                    backgroundColor: "black",
                    "&:hover": {
                        backgroundColor: "green",
                    },
                    textTransform: "capitalize",
                    marginLeft: 3,

                    height: 40,
                }} onClick={search}>Search</Button>
            
        </div>

    )
}
export default Search;