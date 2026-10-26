import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../Utils/Redux/Hooks";
import Styles from './ViewProduct.module.css'


export default function ViewProduct(){

    const allProducts = useAppSelector((state)=> state.products.products)
    const navigate = useNavigate()

    return(
        <div className={Styles.divMayor}>
            <div className={Styles.titlesContainer}>
                
                <label>Fotos</label>
                <label>Nombre</label>
                <label>Categoria</label>
                <label>Estado</label>
                <label>Descripción</label>
                <label>Identificador</label>
            </div>
            <div className={Styles.productsContainer} >
            {allProducts.map((oneproduct) => (
                <div key={oneproduct.id} className={Styles.oneProduct} onClick={() => navigate(`/dash/detail/${oneproduct.id}`)}>
                    <div className={Styles.imageContainer}>
                        <img className={Styles.image} src={oneproduct.photos[0]}/>
                    </div>
                    <label>{oneproduct.name}</label>
                    <label>{oneproduct.category}</label>
                    <label>{oneproduct.active ? "activo" : "inactivo"}</label>
                    <label>{oneproduct.description}</label>
                    <label>{oneproduct.identification ?? " - "}</label>
                </div>
            
            ))}
            </div>
        </div>
    )


}