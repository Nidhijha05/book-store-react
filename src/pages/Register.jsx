import { Button, Select, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import '../pages/Register.css'
import { useNavigate } from "react-router-dom";
import { Formik } from 'formik';
import { signUpSchema } from "../schemas";
import { toast, ToastContainer } from "react-toastify";
import userService from "../service/userService";
import authService from "../service/authService";
import "react-toastify/dist/ReactToastify.css";



function Register() {

    const nav = useNavigate();

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        roleId: '',
        password: '',
        confirmPassword: '',
    }

    const onSubmit = (values, action) => {
        delete values.confirmPassword;
        action.resetForm();
        console.log(values);
        authService.register(values).then((res) => {
            setTimeout(()=>{
                toast.success("Successfully Registered",{theme:"colored"});
            },2000);
            
            nav("/login");
        })
            .catch((err) => {
                console.log(err);
            })
    }
    const [roleList, setRoleList] = useState();

    const getRoles = () => {
        userService.getAllRoles().then((res) => {
            setRoleList(res);
        })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getRoles();
    }, [])
    console.log(roleList);

    return (
        <>

            <div>
               
                <div className="row" style={{
                    marginTop: "30px"
                }}>
                    <h1 style={{
                        fontSize: "32px",
                        fontStyle: 'roboto'
                    }}>Register</h1>
                </div>

                <Formik initialValues={initialValues} validationSchema={signUpSchema} onSubmit={onSubmit}>{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
                    <form onSubmit={handleSubmit}>
                        <div className="form">
                        
                            <div className="fname">
                                <p>First Name*</p>
                                <input type="text" name="firstName" id="fname" value={values.firstName}
                                    onChange={handleChange} onBlur={handleBlur}></input>
                                {errors.firstName && touched.firstName ? (<p className="form-error" style={{ color: 'red' }}>{errors.firstName}</p>) : null}
                            </div>
                            <div className="lname">
                                <p>Last Name*</p>
                                <input type="text" name="lastName" id="lname" value={values.lastName} onChange={handleChange} onBlur={handleBlur} ></input>
                            </div>
                            {errors.lastName && touched.lastName ? (<p className="form-error" style={{ color: 'red' }}>{errors.lastName}</p>) : null}
                        </div>
                        <div className="form">
                        <div className="email">
                            <p>Email Address*</p>
                            <input type="email" name="email" id="email"
                                value={values.email} onChange={handleChange} onBlur={handleBlur}></input>
                            {errors.email && touched.email ? (<p className="form-error" style={{ color: 'red' }}>{errors.email}</p>) : null}
                        </div>

                        <div className="roleId">
                            <p>Role*</p>
                            <Select type="email" name="roleId" id="email" style={{width:610, height:48, borderBlockColor:'black'}}
                                value={values.roleId} onChange={handleChange} onBlur={handleBlur}>
                                    {roleList && roleList.length > 0 && roleList.map((role) => (
                                        <MenuItem value={role.id} key={"name" + role.id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}</Select>
                            {errors.roleId && touched.roleId ? (<p className="form-error" style={{ color: 'red' }}>{errors.roleId}</p>) : null}
                        </div>
                        </div>

                        <div className="login">
                            <h2>Login Information</h2>
                            <hr />
                            <div className="pass">
                                <div className="p1">
                                    <p>Password*</p>
                                    <input type="password" name="password" id="pass"
                                        value={values.pass} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.password && touched.password ? (<p className="form-error" style={{ color: 'red' }}>{errors.password}</p>) : null}
                                </div>
                                <div className="p2">
                                    <p>Confirm Password*</p>
                                    <input type="password" name="confirmPassword" id="pass"
                                        value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.confirmPassword && touched.confirmPassword ? (<p className="form-error" style={{ color: 'red' }}>{errors.confirmPassword}</p>) : null}
                                </div>
                            </div>
                        </div>

                        <div className="btn">
                            <Button variant="contained" color="error" type="submit" disabled={isSubmitting} onClick={handleSubmit}>Register</Button>
                        </div>
                    </form>
                )}
                </Formik>
            </div>
        </>

    );
}

export default Register;