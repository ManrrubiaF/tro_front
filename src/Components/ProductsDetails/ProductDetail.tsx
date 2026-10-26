import Styles from './ProductDetails.module.css'
import {  useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../Utils/Redux/Hooks";
import { useNavigate } from "react-router-dom";
import Product3D from '../3DModule/3dmodule';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavBar from '../NavBar/NavBar';




interface Product {
    id: number;
    name: string;
    description: string;
    photos: string[];
    category: string;
    identification: string;
}


export default function ProductDetail() {

    
    const navigate = useNavigate()
    const { id } = useParams();
    const productsToShow:Product[] = useAppSelector((state) => state.products.productToShow);
    const showDetail = productsToShow.find(product => product.id === Number(id));
    const [show3D, setShow3D] = useState(false);
    


    return (
        <div className={Styles.divMayor}>
            <NavBar />

            <div className={Styles.containerAll}>
                <div className={Styles.containerImg }>
                    <div className={Styles.imageContainer}>
                        <img
                            className={Styles.imageShow}
                            src={showDetail?.photos[0]}
                            alt="imagepreview"
                            onClick={() => setShow3D(true)}
                        />
                    </div>

                    {show3D && (
                        <div
                            className={Styles.modalOverlay}
                            onClick={() => setShow3D(false)}
                        >

                            <div
                                className={Styles.modal3D}
                                onClick={(event) => event.stopPropagation()}
                            >

                                <button
                                    className={Styles.closeButton}
                                    onClick={() => setShow3D(false)}
                                >
                                    ×
                                </button>

                                <Product3D modelUrl={showDetail!.photos[1]} />

                            </div>

                        </div>
                    )}
                    <div className={Styles.divWhatsapp}>                        
                        <a
                            href="https://wa.link/1ck6i3"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faWhatsapp} />
                            <span>
                                <strong>Consultar precio y pedir</strong>
                                <small>Escribinos por WhatsApp</small>
                            </span>
                            <span className={Styles.arrow}>↗</span>
                        </a>
                    </div>
                </div>
                <div className={Styles.details}>
                    <h3>{showDetail?.name}</h3>
                    <p>{showDetail?.description}</p>
                    <button className={Styles.backButton} onClick={() => navigate(-1)}> Volver </button>
                </div>
            </div>

        </div>
    )


}