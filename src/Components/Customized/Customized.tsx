import Styles from './Customized.module.css'
import NavBar from "../NavBar/NavBar";
import { useAppSelector } from "../../Utils/Redux/Hooks";
import { useState } from 'react';
import Product3D from '../3DModule/3dmodule';

interface Product {
    id: number;
    name: string;
    description: string;
    photos: string[];
    category: string;
    identification: string;
}

export default function Customized(){
    
    const [identification, setIdentification] = useState('')
    const [inputValue, setInputValue ] = useState('')
    const productsToShow:Product[] = useAppSelector((state) => state.products.products);
    const showDetail = productsToShow.find(product => product.identification === identification && product.identification !== '');
    const [show3D, setShow3D] = useState(false);

    
    return (
        <div className={Styles.divMayor}>
            <NavBar />
            {showDetail != null ? (
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
                        
                    </div>
                    <div className={Styles.details}>
                        <h3>{showDetail?.name}</h3>
                        <p>{showDetail?.description}</p>                       
                    </div>
                </div>

            ):(
                <form
                    className={Styles.form}
                    onSubmit={(event) => {
                        event.preventDefault();
                        setIdentification(inputValue);
                    }}
                >
                    <label>Ingrese identificador</label>

                    <input
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                    />

                    <button type="submit">
                        Buscar
                    </button>
                </form>
            )

            }

        </div>
    )
}