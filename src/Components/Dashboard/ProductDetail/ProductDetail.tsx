import axios from "axios";
import Styles from './ProductDetail.module.css'
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../Utils/Redux/Hooks";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface Product {
    id: number;
    name: string;
    description: string;
    photos: string[];
    category: string;
    identification: string;
    active: boolean;
}

export default function ProductDetailDash(){

    const navigate = useNavigate()
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY
    const UPLOAD_PRESET = import.meta.env.VITE_PRESET
    const BACK_URL = import.meta.env.VITE_API_URL;
    const CLOUD_URL = import.meta.env.VITE_CLOUD_URL
    const userData = useAppSelector((state) => state.user)
    const {id} = useParams();
    const productToShow = useAppSelector((state) => state.products.products.find(product => product.id === Number(id) ));
    const [ productModified, setProductModified] = useState<Product>(
        {
            id: productToShow!.id,
            name: productToShow!.name,
            description: productToShow!.description,
            photos: productToShow!.photos,
            identification: productToShow!.identification,
            category: productToShow!.category,
            active: productToShow!.active,

        }

    )
    const upload = async (file: string | Blob) => {
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("upload_preset", UPLOAD_PRESET);
        const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        { method: "POST", body: formdata }
        );
        const data = await response.json();
        return data.secure_url;
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = event.target;

        if(event.target instanceof HTMLTextAreaElement){
            setProductModified({
                ...productModified,
                [name]:value
            });
        }else if (event.target instanceof HTMLInputElement){
            setProductModified({
                ...productModified,
                [name]:value,
            })
        }
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`${BACK_URL}/product/update/${id}`,
                productModified,
                {
                    headers:{
                        authorization: `Bearer ${userData?.token}`
                    }
                }
            )
            console.log(response.data)
        } catch (error) {
            console.error(error)            
        }        
    }

    const handleImage = (imageUpdate: string) => {
        setProductModified({
            ...productModified,
            photos:[imageUpdate,productModified.photos[1]]
        })
    }
    const handleDeleteImage = () =>{
        setProductModified({
            ...productModified,
            photos:["", productModified.photos[1]]
        })
    }

    const handleDeleteObj = () => {
        setProductModified({
            ...productModified,
            photos:[productModified.photos[0],""]
        })
    }

    

    const handleUploadCloud = async (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target
        try {
            const response = await axios.post(`${CLOUD_URL}/${productModified.name}`, value,
                {
                    headers: {
                        "Content-Type": "application/octet-stream"
                    }
                }
            )
            const urlObj = response.data.key;
            setProductModified({
                ...productModified,
                photos:[productModified.photos[0],urlObj]
            })
        } catch (error) {
            console.error(error)
            
        }
                
    }




    return (
        <div className={Styles.divMayor}>
            <label>Nombre:</label>
            <input 
                name="name" 
                value={productModified.name} 
                onChange={handleChange} />
            <label> Descripción</label>
            <textarea 
                name="description"
                value={productModified.description}
                onChange={handleChange}
            />
            <label>Identificador</label>
            <input
                name="identification"
                value={productModified.identification}
                onChange={handleChange}
            />
            <label>Estado</label>
            <input 
                type="checkbox"
                checked={productModified.active}
                onChange={()=>setProductModified({...productModified, active: !productModified.active})}
            />
            <label>Categoria</label>
            <input 
                type="text"
                name="category"
                value={productModified.category}
                onChange={handleChange}
            />
            <label> Foto </label>
            {productModified.photos[0] ? (
                <div className={Styles.photoContainer}>
                    <img 
                        src={productModified.photos[0]}
                        alt="Foto del producto"
                        
                    />
                    <FontAwesomeIcon 
                            icon={faX}
                            className={Styles.faXicon}  
                            onClick={()=> handleDeleteImage}
                    />
                </div>
            ):(
            <div className={Styles.inputContainerPhoto}>
                <input
                    className={Styles.fileUpload}
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>{
                        const file =event.target.files?.[0]
                        if(file){
                            upload(file).then(
                                (imageUpdate)=>{
                                    handleImage(imageUpdate)
                                }
                            ).catch((error)=> {
                                console.error(error)
                            })
                        }
                    }}
                />    
            </div>)}
            {productModified.photos[1] ? (
                <div className={Styles.objContainer}>
                    <label>
                        Objeto cargado
                        <FontAwesomeIcon 
                            icon={faX}
                            className={Styles.iconX}
                            onClick={handleDeleteObj}

                        />

                    </label>
                </div>
            ):(
                <div className={Styles.uploadObj}>
                    <label> Cargar Objeto</label>
                    <input 
                        type="file"
                        accept=".obj"
                        onChange={handleUploadCloud}
                    />
                </div>
            )}
            <button onClick={handleSubmit}>Actualizar</button>
            <button onClick={()=>navigate(-1)}>Volver</button>
        </div>
    )
}