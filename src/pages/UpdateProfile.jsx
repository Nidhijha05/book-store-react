import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { Button, TextField, } from "@mui/material";
import userService from "../service/userService";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/auth";
import shared from "../utils/shared";
import "../pages/UpdateProfile.css";

function UpdateProfile() {

    const navigate = useNavigate();
    const authContext = useAuthContext();
    const { user } = useAuthContext();

    const initialValuesState = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        newPassword: "",
        confirmPassword: "",
    }

    const [updatePassword, setUpdatePassword] = useState(false);

    const validate = Yup.object().shape({
        firstName: Yup.string().min(2, "Too short!").max(30, "Too Long!").required("FirstName is required"),
        LastName: Yup.string().min(2, "Too short!").max(30, "Too Long!").required("LastName is required"),
        email: Yup.string().email("Invalid Email").required("Email is required"),
        newPassword: Yup.string().min(6, "Too short!").max(30, "Too Long!").required("Minimum 5 characters are required"),
        confirmPassword: updatePassword ? Yup.string().required("Required").oneOf([Yup.ref("newPassword")], "Password does not match")
            : Yup.string().oneOf([Yup.ref("newPassword")], "Password does not match")

    })

    const onSubmit = async (values) => {
        const password = values.newPassword ? values.newPassword : user.password;
        delete values.confirmPassword;
        delete values.newPassword;
        const data = Object.assign(user, { ...values, password });
        const res = await userService.updateProfile(data);
        if (res) {
            authContext.setUser(res);
            toast.success(shared.messages.UPDATED_SUCCESS,{theme:"colored"});
            navigate("/");

        }
    }

    return (
        <div className="update">
            <div className="update-heading">
                <h1 className="update-heading-h">
                    Update Profile
                </h1> 
            </div>

            <Formik
                initialValues={initialValuesState}
                validationSchema={validate}
                enableReinitialize={true}
                onSubmit={onSubmit}>
                {({
                    values, errors, touched, handleBlur, handleChange, handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="update-form">
                            <div className="update-form-first">
                                <label>First Name*</label>
                                <TextField
                                    size="small"
                                    type="text"
                                    name="firstName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstName}
                                    sx={{ width: "100%", height: "40px", marginTop: "10px",marginBottom:"15px"}}
                                />
                                <div className="text-red-600">
                                    {errors.firstName && touched.firstName ? (<p className="form-error" style={{ color: 'red' }}>{errors.firstName}</p>):null}
                                </div>
                            </div>

                            <div className="update-form-last">
                                <label>Last Name*</label>
                                <TextField
                                    size="small"
                                    type="text"
                                    name="lastName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lastName}
                                    sx={{ width: "100%", height: "40px", marginTop: "10px",marginBottom:"15px" }}
                                />
                                <div className="text-red-600">
                                    {errors.lastName && touched.lastName ? (<p className="form-error" style={{ color: 'red', }}>{errors.lastName}</p>) : null}
                                </div>
                            </div>
                        </div>

                        <div className="update-form">
                            <div className="update-form-email">
                                <label>Email Address*</label>
                                <TextField
                                    size="small"
                                    type="text"
                                    name="firstName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    sx={{ width: "100%", height: "40px", marginTop: "10px",marginBottom:"15px" }}
                                />
                                <div className="text-red-600">
                                    {errors.email && touched.email ? (<p className="form-error" style={{ color: 'red', }}>{errors.email}</p>) : null}
                                </div>
                            </div>

                            <div className="update-form-password">
                                <label>Password*</label>
                                <TextField
                                    size="small"
                                    type="password"
                                    name="newPassword"
                                    onChange={(e)=>{
                                        e.target.value !==""
                                        ? setUpdatePassword(true)
                                        :setUpdatePassword(false);
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    values={values.newPassword}
                                    sx={{ width: "100%", height: "40px", marginTop: "10px",marginBottom:"15px" }}
                                />
                                <div className="text-red-600">
                                    {errors.newPassword && touched.newPassword ? (<p className="form-error" style={{ color: 'red', }}>{errors.newPassword}</p>) : null}
                                </div>
                            </div>
                        </div>

                        <div className="update-form">
                            <div className="update-form-cnfpassword">
                                <label>Confirm Password*</label>
                                <TextField
                                    size="small"
                                    type="text"
                                    name="confirmPassword"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}
                                    sx={{ width: "100%", height: "40px", marginTop: "10px",marginBottom:"15px" }}
                                />
                                <div className="text-red-600">
                                    {errors.confirmPassword && touched.confirmPassword ? (<p className="form-error" style={{ color: 'red', }}>{errors.confirmPassword}</p>) : null}
                                </div>
                            </div>
                            </div>

                            <div className="update-form-btn">
                                <Button variant="contained"
                                 sx={{
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
                                    navigate("/");
                                }}>Cancel</Button>
                            </div>
                        
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default UpdateProfile;