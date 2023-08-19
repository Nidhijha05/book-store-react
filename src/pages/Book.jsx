import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, TextField, TablePagination, Typography } from "@mui/material";
import { RecordsPerPage, defaultFilter } from "../constant/constant";
import '../pages/Book.css';
import categoryService from "../service/categoryService";
//import * as Yup from 'yup';
import bookService from "../service/bookService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import shared from "../utils/shared";
import ConfirmationDialog from "../components/ConfirmationDialog";
//import { Formik,Form,Field} from 'formik';


function Book() {

    const [filters, setFilters] = useState(defaultFilter);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const navigate = useNavigate();
    const [bookRecords, setBookRecords] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    })


    useEffect(() => {
        getAllCategories();
    }, []);
    const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
            if (res) {
                setCategories(res);
            }
        })
    }

    const searchBooks = (filters) => {
        bookService.getAll(filters).then((res) => {
            setBookRecords(res);
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword;
            searchBooks({ ...filters });
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const columns = [
        { id: "BookName", label: "Book Name" },
        { id: "Price", label: "Price" },
        { id: "Category", label: "Category" }
    ]

    const onConfirmDelete = () => {
        bookService
            .deleteBook(selectedId)
            .then((res) => {
                toast.success(shared.messages.DELETE_SUCCESS,{theme:"colored"});
                setOpen(false);
                setFilters({ ...filters, pageIndex: 1 });
            })
            .catch((e) => {
                toast.error(shared.messages.DELETE_FAIL,{theme:"colored"});
            })
    }



    return (
        <div className="bk">
         
            <div className="heading">
                <h1 className="heading-h">
                    Here are the all books -
                </h1>
            </div>

            <div className="table">
                <div className="table-search">
                    <TextField 
                    name="text"
                    placeholder="Search here"
                    variant="outlined"
                    onChange={(e)=>{
                        setFilters({
                            ...filters,
                            keyword: e.target.value,
                            pageIndex:1
                        })
                    }}
                    sx={{width:280}}></TextField>

                    <Button 
                        variant="contained"
                        color="error"
                        sx={{
                            color:"white",
                            width: 100,
                            borderRadius: 0, 
                            height: 40,
                            textTransform:"capitalize",
                            backgroundColor:"black",
                            marginLeft:3,
                            "&:hover":{
                                backgroundColor:"green",
                            },
                            
                        }} 
                        onClick={()=>{
                            navigate("/add-book")
                        }}>Add</Button>
                </div>

                <div className="cat-main">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column)=>(
                                        <TableCell
                                            key={column.id}
                                            style={{maxWidth: column.maxWidth,fontWeight: "bold"}}>
                                                {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{marginTop: "20px"}}>
                                {bookRecords?.items?.map((row,index)=>(
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>{categories.find((c)=>c.id === row.categoryId)?.name}</TableCell>
                                        <TableCell sx={{
                                            display: "flex",
                                            alignItems:"flex-end",
                                            justifyContent:"flex-end",
                                        }}>
                                            <Button variant="outlined" disableElevation
                                                sx={{
                                                    borderColor:"#80BF32",
                                                    textTransform:"capitalize",
                                                    backgroundColor: "blue",
                                                    color:"black",
                                                    width:"80px",
                                                    height:30,
                                                    fontWeight:"bold",
                                                    marginRight: "20px",
                                                }}
                                                onClick={()=>{
                                                    navigate(`/add-book/${row.id}`);
                                                }}>Edit</Button>

                                            <Button variant="outlined" disableElevation
                                                sx={{
                                                    borderColor:"#f14d54",
                                                    textTransform:"capitalize",
                                                    color:"#f14d54",
                                                    backgroundColor: "black",
                                                    color:"red",
                                                    width:80,
                                                    height:30,
                                                    fontWeight:"bold",
                                                    paddingRight:-10,
                                                }}
                                                onClick={()=>{
                                                    setOpen(true);
                                                    setSelectedId(row.id)
                                                }}>Delete</Button>
                                        </TableCell>

                                    </TableRow>
                                ))}
                                 {!bookRecords.items.length && (
                <TableRow className="TableRow">
                  <TableCell colSpan={5} className="TableCell">
                    <Typography align="center" className="noDataText">
                      No Books
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div className="table-page">
                    <TablePagination 
                        rowsPerPageOptions={RecordsPerPage}
                        component="div"
                        count={bookRecords.totalItems}
                        rowsPerPage={filters.pageSize || 0}
                        page={filters.pageIndex-1}
                        onPageChange={(e,newPage)=> {
                            setFilters({...filters,pageIndex:newPage+1})
                        }}
                        onRowsPerPageChange={(e)=>{
                            setFilters({
                                ...filters,pageIndex:1,
                                pageSize: Number(e.target.value),
                            })
                        }}
                        >

                    </TablePagination>
                </div>
                <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onConfirmDelete()}
        title="Delete book"
        description="Are you sure you want to delete ?"
      />
            </div>
        </div>

    )
}

export default Book;