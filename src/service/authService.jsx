
import request from "./request";
const ENDPOINT = "api/user";

const login = async(values) => {
    const url = `${ENDPOINT}/login`;
    return request.post(url, values).then((res)=>{
        return res;
    })
}

const register = async(values)=>{
    const url = `${ENDPOINT}`;
    return request.post(url, values).then((res)=>{
        return res;
    })
}

const authService = {
    login,
    register,
}

export default authService;
