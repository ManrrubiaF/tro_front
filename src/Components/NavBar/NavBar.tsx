import { useNavigate } from "react-router-dom"
import Styles from './NavBar.module.css'
import logo from '../../assets/Logo TRO.png'
export default function NavBar (){

    const navigate = useNavigate();


    return(
        <div className={Styles.divMayor}>
            <img src={logo} className={Styles.logo} /> 
            <h1>Tu Regalo Original</h1>              
            <div className={Styles.divContainer}>                
                <p className={Styles.pOptions} onClick={()=> navigate('/')}>
                    Home
                </p>
                <p className={Styles.pOptions} onClick={()=> navigate('/products')}>
                    Productos
                </p>
                <p className={Styles.pOptions} onClick={()=> navigate('/personalizados')}>
                    Personalizados
                </p>
            </div>

        </div>
    )
}