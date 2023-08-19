import { Button,Stack,TextField } from "@mui/material";
import React from "react";
import { Link,useNavigate } from "react-router-dom";
import '../pages/Login.css'
import { Formik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import authService from "../service/authService";
import { loginSchema } from "../schemas";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../context/auth";



function Login() {

    const initialValues={
        email:'',
        password:''
    }

    const nav =useNavigate();
    const authContext = useAuthContext();


    const onSubmit= (values) => {
        authService
        .login(values).then((res)=>{
            delete res._id;
            delete res.__v;
            authContext.setUser(res);
            setTimeout(()=>{
                toast.success(" log in Successfully");
            },2000);
        
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    

    return(
        <div className="lgn">
        
                <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={onSubmit}>
                    {({values,errors,touched,handleChange,handleBlur,handleSubmit,}) => (
                <form onSubmit={handleSubmit}>
                <Stack direction={"column"} className="right_field">
                    <Stack direction={"column"} className="login_input_container">
                        <p>Email:</p>
                        <TextField
                            type="email"
                            required
                            name="email"
                            size='large'
                            placeholder="Enter your Email"
                            className="email_input"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{width: 500}}
                            />
                            {errors.email && touched.email? (<p className="form-erro" style={{color:'red'}}>{errors.email}</p>):null}
                    </Stack>

                    <Stack direction={"column"} className="login_input_container">
                        <p>Password:</p>
                        <TextField
                            type="password"
                            required
                            name="password"
                            size='small'
                            placeholder="Enter your Password"
                            className="email_input"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{width: 500}}
                            
                            
                            />
                            {errors.password && touched.password? (<p className="form-erro" style={{color:'red'}}>{errors.password}</p>):null}
                    </Stack>

                    <Stack direction={"column"} className="login_right_btn">
                        <Button color="error" sx={{height:40}} variant="contained" className="login_right_btn" type="submit">
                            Login
                        </Button>
                    </Stack>
                </Stack>
                </form>
                    )}
                </Formik>
            
        </div>
    )
}
export default Login;