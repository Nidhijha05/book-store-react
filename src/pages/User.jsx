import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, TextField, TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { defaultFilter, RecordsPerPage } from "../constant/constant";
import { useAuthContext } from "../context/auth";
import userService from "../service/userService";
import shared from "../utils/shared";
import "../pages/User.css";

function User() {

    const navigate = useNavigate();
    const authContext = useAuthContext();
    const [filters, setFilters] = useState(defaultFilter);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [userList, setUserList] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword;
            getAllUsers({ ...filters })
        }, 500)
        return () => clearTimeout(timer);
    }, [filters]);

    const getAllUsers = async (filters) => {
        await userService.getAllUsers(filters).then((res) => {
            if (res) {
                setUserList(res);
            }
        })
    }

    const columns = [
        { id: "FirstName", label: "First Name" },
        { id: "LastName", label: "Last Name" },
        { id: "Email", label: "Email" },
        { id: "roleName", label: "Role" },
    ]

    const onConfirmDelete = async () => {
        await userService.deleteUser(selectedId).then((res) => {
            if (res) {
                toast.success(shared.messages.DELETE_SUCCESS,{theme:"colored"})
                setOpen(false);
                setFilters({ ...filters });
            }
        })
            .catch((err) => {
                toast.error(shared.messages.DELETE_FAIL,{theme:"colored"});
            })
    }

    return (
        <div className="user">
            <div className="user-heading">
                <h1 className="user-heading-h">
                    USER&#xf4fc;
                </h1>
            </div>


            <div className="user-search">
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

            </div>

            <div className="user-table">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} style={{ maxWidth: column.maxWidth, fontWeight: "bold" }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ marginTop: "20px" }}>
                            {userList?.items?.map((row, index) => (
                                <TableRow key={`${row.id}-${index}`}>
                                    <TableCell>{row.firstName}</TableCell>
                                    <TableCell>{row.lastName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell sx={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                    }}>
                                        <Button variant="outlined" disableElevation
                                            sx={{
                                                textTransform: "capitalize",
                                                backgroundColor:"blue",
                                                color: "black",
                                                width: "80px",
                                                height: 30,
                                                marginRight: "20px",
                                            }}
                                            onClick={() => {
                                                navigate(`/edit-user/${row.id}`);
                                            }}>Edit</Button>
                                        {row.id !== authContext.user.id && (

                                            <Button variant="outlined" disableElevation
                                                sx={{
                                                    textTransform: "capitalize",
                                                    color: "red",
                                                    backgroundColor: "black",
                                                    width: 80,
                                                    height: 30,
                                                    paddingRight: -10,
                                                }}
                                                onClick={() => {
                                                    setOpen(true);
                                                    setSelectedId(row.id ?? 0)
                                                }}>Delete</Button>)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!userList.items.length && (
                                <TableRow className="TableRow">
                                    <TableCell colSpan={5} className="TableCell">
                                        <Typography align="center" className="noDataText">
                                            No user
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className= "user-page">
            <TablePagination
          rowsPerPageOptions={RecordsPerPage}
          component="div"
          count={userList?.totalItems || 0}
          rowsPerPage={filters.pageSize || 0}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
        />
            </div>
            <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onConfirmDelete()}
        title="Delete book"
        description={shared.messages.USER_DELETE}
      />

        </div>
    )
}

export default User;