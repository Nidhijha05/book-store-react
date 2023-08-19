import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, TextField, TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { defaultFilter, RecordsPerPage } from "../constant/constant";
import { useAuthContext } from "../context/auth";
import categoryService from "../service/categoryService";
import shared from "../utils/shared";
import "../pages/Category.css";


function Category() {

    const navigate = useNavigate();
    const authContext = useAuthContext();

    const [filters, setFilters] = useState(defaultFilter);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [categoryRecords, setCategoryrecords] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,

    })

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword;
            searchAllCategories({ ...filters });
        }, 500);
        return () => clearTimeout(timer)
    }, [filters]);

    const searchAllCategories = (filters) => {
        categoryService.getAll(filters).then((res) => {
            setCategoryrecords(res);
        }
        )
    }

    const columns = [{ id: "name", label: "Category Name" }]

    const onConfirmDelete = async () => {
        await categoryService.deleteCategory(selectedId)
            .then((res) => {
                if (res) {
                    toast.success(shared.messages.DELETE_SUCCESS,{theme:"colored"});
                    setOpen(false);
                    setFilters({ ...filters });
                }
            })
            .catch((err) => {
                toast.error(shared.messages.DELETE_FAIL,{theme:"colored"});
            })

    }

    return (
        <div className="category">
            <div className="heading">
                <h1 className="heading-h">
                    Categories
                </h1> 
            </div>

            <div className="cat">
                <div className="cat-search">
                    <TextField
                        name="text"
                        placeholder="Search here"
                        variant="outlined"
                        size="small"
                        onChange={(e) => {
                            setFilters({
                                ...filters,
                                keyword: e.target.value,
                                pageIndex: 1
                            })
                        }}
                        sx={{ width: 280 }}></TextField>

                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            color: "white",
                            width: 100,
                            borderRadius: 0,
                            height: 40,
                            textTransform: "capitalize",
                            backgroundColor: "#black",
                            marginLeft: 3,
                            "&:hover": {
                                backgroundColor: "green",
                            },

                        }}
                        onClick={() => {
                            navigate("/add-category")
                        }}>Add</Button>
                </div>

                <div className="cat-main">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}
                                            style={{ maxWidth: column.maxWidth, fontWeight: "bold" }}>
                                            {column.label}</TableCell>
                                    ))}
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ marginTop: "20px" }}>
                                {categoryRecords?.items?.map((row, index) => (
                                    <TableRow key={`${row.id}-${index}`}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell sx={{
                                            display: "flex",
                                            alignItems: "flex-end",
                                            justifyContent: "flex-end",
                                        }}>
                                            <Button variant="outlined" disableElevation
                                                sx={{
                                                    borderColor: "#80BF32",
                                                    textTransform: "capitalize",
                                                    backgroundColor: "blue",
                                                    color: "black",
                                                    width: "80px",
                                                    fontWeight:"bold",
                                                    height: 30,
                                                    marginRight: "20px",
                                                }}
                                                onClick={() => {
                                                    navigate(`/add-category/${row.id}`);
                                                }}>Edit</Button>
                                            {row.id !== authContext.user.id && (

                                                <Button variant="outlined" disableElevation
                                                    sx={{
                                                        borderColor: "#f14d54",
                                                        textTransform: "capitalize",
                                                        backgroundColor: "black",
                                                        fontWeight:"bold",
                                                        color: "red",
                                                        width: 80,
                                                        height: 30,
                                                        paddingRight: -10,
                                                    }}
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setSelectedId(row.id ?? 0)
                                                    }}>Delete</Button>)}
                                        </TableCell>

                                        {!categoryRecords.items.length && (
                                            <TableRow className="TableRow">
                                                <TableCell colSpan={5} className="TableCell">
                                                    <Typography align="center" className="noDataText">
                                                        No Books
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                    </TableRow>


                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div className="cat-page">
                    <TablePagination
                        rowsPerPageOptions={RecordsPerPage}
                        component="div"
                        count={categoryRecords.totalItems}
                        rowsPerPage={filters.pageSize || 0}
                        page={filters.pageIndex - 1}
                        onPageChange={(e, newPage) => {
                            setFilters({ ...filters, pageIndex: newPage + 1 })
                        }}
                        onRowsPerPageChange={(e) => {
                            setFilters({
                                ...filters, pageIndex: 1,
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
                    title="Delete Category"
                    description="Are you sure you want to delete this category?"
                />

            </div>

        </div>
    )
}

export default Category;