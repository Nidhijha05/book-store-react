import React,{useState,useEffect} from "react";
import { useNavigate,useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/auth";
import shared from "../utils/shared";
import userService from "../service/userService";
import "../pages/EditUser.css"
import { Button,TextField,Select, MenuItem } from "@mui/material";

function EditUser() {

    const {id} = useParams();

    const initialValues={
        firstName: "",
        lastName: "",
        email: "",
        roleId: "",
    }

    const [initialValueState, setInitialValueState] = useState(initialValues);

    const navigate = useNavigate();
    const authContext =useAuthContext();
    const [user,setUser]=useState();
    const [roles,setRoles] =useState([]);

    

   

    useEffect(()=>{
        if(user && roles.length){
            const roleId = roles.find((role)=>role.name === user?.role)?.id;

            setInitialValueState({
                id: user.id,
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                roleId,
                //password: user.password,
            })
        }
    },[user,roles])

    const validationSchema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email address format")
          .required("Email is required"),
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        roleId: Yup.number().required("Role is required"),
      });


    const getUserById=()=>{
        userService.getById(Number(id)).then((res)=>{
            if(res){
                setUser(res);
            }
        })
    }
    useEffect(()=>{
        if(id){
            getUserById()
        }
    },[id]);

    const getRoles=()=>{
        userService.getAllRoles().then((res)=>{
            setRoles(res);
        })
    }
    useEffect(()=>{
        getRoles();
    })

    const onSubmit = (values)=>{
        const updatedValue={
            ...values,
            role: roles.find((r)=>r.id===values.roleId).name
        }
        userService.update(updatedValue).then((res)=>{
            if(res){
                toast.success(shared.messages.UPDATED_SUCCESS,{theme:"colored"})
                navigate("/user")
            }
        })
        .catch((e) => toast.error(shared.messages.UPDATED_FAIL,{theme:"colored"}));
    }

    return(
        <div className="edit">
            <div className="edit-heading">
                <h1 className="edit-heading-h">
                    Edit User
                </h1> <hr />
            </div>

            <Formik
                initialValues={initialValueState}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={onSubmit}>
                {({
                    values, errors, touched, handleBlur, handleChange, handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="edit-form">
                            <div className="edit-form-first">
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

                            <div className="edit-form-last">
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

                        <div className="edit-form">
                            <div className="edit-form-email">
                                <label>Email Address*</label>
                                <TextField
                                    size="small"
                                    type="emsil"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    sx={{ width: "100%", height: "40px", marginTop: "10px",marginBottom:"15px"}}
                                />
                                <div className="text-red-600">
                                    {errors.email && touched.email ? (<p className="form-error" style={{ color: 'red' }}>{errors.email}</p>):null}
                                </div>
                            </div>

                            {values.id !== authContext.user.id && (
                            <div className="edit-form-role">
                                <label htmlFor="roleId">Role*</label>
                                <Select name="roleId"
                                label="roleId"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={Number(values.roleId)}
                                size="small"
                                disabled={values.id === authContext.user.id}
                                sx={{width:610, height:40,marginTop:1}}
                                >
                                    {roles.length > 0 &&
                      roles.map((role) => (
                        <MenuItem value={role.id} key={"name" + role.id}>
                          {role.name}
                        </MenuItem>
                      ))}

                                </Select>
                            </div>
                            )}

                            
                        </div>
                        <div className="edit-form-btn">
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
                                    navigate("/user");
                                }}>Cancel</Button>
                            </div>

                        </form>
                        )}
                    </Formik>
                
        </div>
    )
}



export default EditUser;

