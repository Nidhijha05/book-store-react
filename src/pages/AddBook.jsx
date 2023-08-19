import React, { useEffect, useState } from "react";
import { Button, MenuItem, Input, Select, TextField } from "@mui/material"
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import bookService from "../service/bookService";
import categoryService from "../service/categoryService";
import shared from "../utils/shared";
import "../pages/AddBook.css";

function AddBook() {

    const { id } = useParams();
    const [categories, setCategories] = useState([]);

    const initialValues = {
        name: "",
        price: "",
        categoryId: 0,
        description: "",
        base64image: "",
    }

    const [initialValueState, setInitialValueState] = useState(initialValues);

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getBookById();
        }
        categoryService.getAll().then((res) => {
            setCategories(res);
        })
    }, [id]);

    const getBookById = () => {
        bookService.getById(Number(id)).then((res) => {
            setInitialValueState({
                id: res.id,
                name: res.name,
                price: res.price,
                categoryId: res.categoryId,
                description: res.description,
                base64image: res.base64image,
            });
        })
    }

    const validate = Yup.object({
        name: Yup.string().required("Book name is required"),
        description: Yup.string().required("Description is required"),
        categoryId: Yup.number().min(1, "Category is required").required("Category is required"),
        price: Yup.number().required("Price is required"),
        base64image: Yup.string().required("Image is required"),
    })

    const onSubmit = (values) => {
        bookService.save(values).then(() => {
            toast.success(values.id ? shared.messages.UPDATED_SUCCESS : "Record created successfully",{theme:"colored"})
            navigate("/book");
        })
            .catch(() => toast.error(shared.messages.UPDATED_FAIL,{theme:"colored"}))
    }

    const onSelectFile = (e, setFieldValue, setFieldError) => {
        const files = e.target.files;
        if (files?.length) {
            const fileSelected = e.target.files[0]
            const fileNameArray = fileSelected.name.split(".");
            const extension = fileNameArray.pop();
            if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
                if (fileSelected.size > 50000) {
                    toast.error("File size must be less than 50KB",{theme:'colored'});
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(fileSelected);
                reader.onload = function () {
                    setFieldValue("base64image", reader.result);
                }
                reader.onerror = function (error) {
                    throw error;
                }
            }
            
        }
        else {
            setFieldValue("base64image", "");
        }
    }

    return (
        <div className="book">
            <div className="add-title">
                {id ? (
                    <h1>Edit Book</h1>
                ) : (<h1>Add Book</h1>)}
                <hr />
            </div>

            <Formik
                initialValues={initialValueState}
                validationSchema={validate}
                onSubmit={onSubmit}
                enableReinitialize={true}>
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldError }) => (
                    <form onSubmit={handleSubmit} className="add-title-form">
                        <div className="form">

                            <div className="form-name">

                                <label>Book Name*</label>
                                <TextField size="small"
                                    type="text"
                                    name="name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    sx={{ width: "100%", height: "40px", marginTop: "10px" }}
                                />
                                <div className="red">
                                    {errors.name && touched.name ? (<p className="form-error" style={{ color: 'red' }}>{errors.name}</p>) : null}
                                </div>

                            </div>


                            <div className="form-price">

                                <label>Book Price(Rs)*</label>
                                <TextField size="small"
                                    type="text"
                                    name="price"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.price}
                                    sx={{ width: "100%", height: "40px", marginTop: "10px", }}
                                />
                                <div className="red">
                                    {errors.price && touched.price ? (<p className="form-error" style={{ color: 'red', }}>{errors.price}</p>) : null}
                                </div>
                            </div>
                        </div>

                        <div className="form">

                            <div className="form-category">

                                <label htmlFor="roleId">Category*</label>
                                <Select
                                    sx={{ width: "100%", height: "40px", marginTop: "10px", marginBottom: "10px" }}
                                    name="categoryId"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.categoryId}
                                    size="small">
                                    {categories?.map((cat) => (
                                        <MenuItem value={cat.id} key={"categories" + cat.id} sx={{
                                            "&:hover": {
                                                backgroundColor: "#EF6F6F",
                                            },

                                        }}>{cat.name}</MenuItem>
                                    ))}
                                </Select>
                                <div className="red">
                                    {errors.categoryId && touched.categoryId ? (<p className="form-error" style={{ color: 'red' }}>{errors.categoryId}</p>) : null}
                                </div>
                            </div>

                            <div className="form-image">
                                {!values.base64image && (
                                    <>
                                        <Input type="file"
                                            size="small"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                onSelectFile(e, setFieldValue, setFieldError)
                                            }} /><div className="red">
                                            {errors.base64image && touched.base64image ? (<p className="form-error" style={{ color: 'red' }}>{errors.base64image}</p>) : null}
                                        </div>

                                    </>
                                )}
                                {values.base64image && (
                                    <div>
                                        <em>
                                            <img
                                                src={values.base64image}
                                                alt=""
                                                style={{ height: "60px", width: "45px" }}
                                            />
                                        </em>

                                        <span
                                            onClick={() => {
                                                setFieldValue("base64image", "")
                                                    ;
                                            }}
                                            style={{ paddingLeft: '10px', }}
                                        >
                                            image <b style={{ cursor: 'pointer' }}> x </b>
                                        </span>
                                    </div>
                                )}
                            </div>


                        </div>
                        <div className="form">

                            <div className="form-description">

                                <label>Description*</label>
                                <TextField size="small"
                                    type="text"
                                    name="description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    multiline
                                    sx={{ width: "100%", height: "100%", marginTop: "10px" }}
                                />
                                <div className="red">
                                    {errors.description && touched.description ? (<p className="form-error" style={{ color: 'red',marginTop:'-30px' }}>{errors.description}</p>) : null}
                                </div>

                            </div>

                        </div>
                        <div className="form-btn">
                                <Button variant="contained"
                                 sx={{
                                    color: "white",
                                    backgroundColor: "#80BF32",
                                    "&:hover": {
                                        backgroundColor: "#80BF32",
                                    },
                                    marginLeft: "8px",
                                    width: "100px",
                                    height:"40px",
                                }} type="submit" disableElevation>Save</Button>

                                <Button variant="contained" sx={{
                                    color: "white",
                                    backgroundColor: "#f14d54",
                                    "&:hover": {
                                        backgroundColor: "#f14d54",
                                    },
                                    marginLeft: "8px",
                                    width: "100px",
                                    height:"40px",
                                }} onClick={() => {
                                    navigate("/book");
                                }}>Cancel</Button>
                            </div>




                    </form>
                )}
            </Formik>

        </div>


    )
}

export default AddBook;