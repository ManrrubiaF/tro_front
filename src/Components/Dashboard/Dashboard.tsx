import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../Utils/Redux/Hooks";
import Styles from './Dashboard.module.css'
import { useState, type ChangeEvent } from "react";
import { setUser } from "../../Utils/Redux/userslice";
import ViewProduct from "./ViewProduct/ViewProduct";
import CreateProduct from "./CreateProduct/CreateProduct";


export default function Dashboard(){
    
    const dispatch = useAppDispatch()
    const userData = useAppSelector((state)=> state.user)
    const BACK_URL = import.meta.env.VITE_API_URL
    const [viewComponent, setComponent ] = useState<React.ReactNode>(<ViewProduct />)
    const [userLogin, setUserLogin] = useState({
        email:"",
        pass:""
    })
    



    const loginReq = async()=>{
        try {
            const response = await axios.post(`${BACK_URL}/user/login`,
                userLogin
            )            
            dispatch(setUser(response.data))
        } catch (error) {
            console.error(error)            
        }
    }

    const handleChangeLogin = (event: ChangeEvent<HTMLInputElement>)=>{
        const {name, value } = event.target;

        setUserLogin({
            ...userLogin,
            [name] : value,
        })
    }



    return (
        <div className={Styles.divMayor}>
            { userData !== null ? (
                <div className={Styles.containerAll}>
                    <div className={Styles.ButtonContainer}>
                        <button onClick={()=> setComponent(< CreateProduct />)}>Crear producto</button>
                        <button onClick={()=>setComponent(< ViewProduct />)}>Productos</button>
                    </div>
                    {viewComponent}
                </div>
                
            ):(
                <div className={Styles.loginCard}>
                    <label> Ingrese email</label>
                    <input 
                    name="email"
                    value={userLogin.email} 
                    onChange={handleChangeLogin}/>
                    <label> Ingrese contraseña</label>
                    <input 
                        name="pass"
                        value={userLogin.pass}
                        type="password"
                        onChange={handleChangeLogin}
                    />
                    <button onClick={loginReq}> Iniciar sesion</button>
                </div>
            )
            }

        </div>
    )
}