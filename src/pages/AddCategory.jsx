import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import categoryService from "../service/categoryService";
import shared from "../utils/shared";
import "../pages/AddCategory.css"


function AddCategory() {

    const { id } = useParams();

    const navigate = useNavigate();
    const initialValues = {
        name: "",
    }

    const [initialValuesState, setInitialValueState] = useState(initialValues);
    useEffect(() => {
        if (id) {
            getCategoryById()
        }
    }, [id]);

    const validate = Yup.object({
        name: Yup.string().required("Category is required"),
    })

    const getCategoryById = () => {
        categoryService.getById(Number(id)).then((res) => {
            setInitialValueState({
                id: res.id,
                name: res.name,
            })
        })
    }

    const onSubmit = (values) => {
        categoryService.save(values).then((res) => {
            toast.success(values.id ? shared.messages.UPDATED_SUCCESS : "Record created successfully",{theme:"colored"})
            navigate("/category");
            
        })
            .catch(() => toast.error(shared.messages.UPDATED_FAIL,{theme:"colored"}))

    }

    return (
        <div className="cat">
            <div className="cat-title">
                {id ? (
                    <h1>Edit Category</h1>
                ) : (<h1>Add Category</h1>)}
                <hr />
            </div>

            <Formik
                initialValues={initialValuesState}
                validationSchema={validate}
                onSubmit={onSubmit}
                enableReinitialize={true}>
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, }) => (
                    <form onSubmit={handleSubmit} className="add-title-form">
                        <div className="form">

                            <div className="form-cname">

                                <label>Category Name*</label>
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
                            </div>


                            <div className="cat-btn">
                                <Button variant="contained"  sx={{
                                    color: "white",
                                    backgroundColor: "#80BF32",
                                    "&:hover": {
                                        backgroundColor: "#80BF32",
                                    },
                                    marginLeft: "8px",
                                    width: "100px",
                                }} type="submit" disableElevation>Save</Button>

                                <Button variant="contained" sx={{
                                    color: "white",
                                    backgroundColor: "#f14d54",
                                    "&:hover": {
                                        backgroundColor: "#f14d54",
                                    },
                                    marginLeft: "8px",
                                    width: "100px",
                                }} onClick={() => {
                                    navigate("/category")
                                }}>Cancel</Button>
                            </div>
                        


                    </form>
                )}
            </Formik>

        </div>
    )
}

export default AddCategory;