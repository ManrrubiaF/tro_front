import axios from "axios";
import Styles from './CreateProduct.module.css'
import { useAppDispatch, useAppSelector } from "../../../Utils/Redux/Hooks";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { addProduct } from "../../../Utils/Redux/productSlice";

interface Product {
    
    name: string;
    description: string;
    photos: string[];
    category: string;
    identification: string;
    active: boolean;
}

export default function CreateProduct(){

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY
    const UPLOAD_PRESET = import.meta.env.VITE_PRESET
    const dispatch = useAppDispatch();
    const BACK_URL = import.meta.env.VITE_API_URL;
    const userData = useAppSelector((state) => state.user)
    const [uploadingObj, setUploadingObj] = useState(false);
    const [ newProduct, setnewProduct] = useState<Product>(
        {
            
            name: "",
            description: "",
            photos: [],
            identification: "",
            category: "",
            active: true,

        }

    )
    const products = useAppSelector((state) => state.products.products);

    const categories = [
        ...new Map(
            products
                .map((product) => product.category.trim())
                .filter(Boolean)
                .map((category) => [category.toLowerCase(), category])
        ).values()
    ];

    console.log(newProduct)

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
            setnewProduct({
                ...newProduct,
                [name]:value
            });
        }else if (event.target instanceof HTMLInputElement){
            setnewProduct({
                ...newProduct,
                [name]:value,
            })
        }
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${BACK_URL}/product/create`,
                newProduct,
                {
                    headers:{
                        authorization: `Bearer ${userData?.token}`
                    }
                }
            )
            
            dispatch(addProduct(response.data))           
            

            setnewProduct(
                {
                    
                    name: "",
                    description: "",
                    photos: [],
                    identification: "",
                    category: "",
                    active: true,

                }
            )
            
        } catch (error) {
            console.error(error)            
        }        
    }
    

    const handleImage = (imageUpdate: string) => {
        setnewProduct({
            ...newProduct,
            photos:[imageUpdate,newProduct.photos[1]]
        })
    }
    const handleDeleteImage = () =>{
        setnewProduct({
            ...newProduct,
            photos:["", newProduct.photos[1]]
        })
    }

    
    const handleDeleteObj = async () => {
        const publicUrl = newProduct.photos[1];

        // Si no hay objeto cargado, no hay nada que borrar.
        if (!publicUrl) return;

        try {
            await axios.delete(`${BACK_URL}/r2/delete`, {
                data: { publicUrl },
                headers: {
                    authorization: `Bearer ${userData?.token}`,
                },
            });

            setnewProduct(prev => ({
                ...prev,
                photos: [prev.photos[0] ?? "", ""],
            }));
        } catch (error) {
            console.error("Error al eliminar el objeto de R2:", error);
        }
    };

    

    
    const handleUploadR2 = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setUploadingObj(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `${BACK_URL}/r2/upload`,
                formData,
                {
                    headers: {
                        authorization: `Bearer ${userData?.token}`,
                    },
                }
            );

            const urlObj = response.data.publicUrl;

            setnewProduct(prev => ({
                ...prev,
                photos: [prev.photos[0] ?? "", urlObj],
            }));

        } catch (error) {
            console.error("Error al subir el modelo a R2:", error);
        } finally {
            setUploadingObj(false);
            event.target.value = "";
        }
    };

                
   




    return (
        <div className={Styles.divMayor}>
            <label>Nombre:</label>
            <input 
                name="name" 
                value={newProduct.name} 
                onChange={handleChange} />
            <label> Descripción</label>
            <textarea 
                name="description"
                value={newProduct.description}
                onChange={handleChange}
            />
            <label>Identificador</label>
            <input
                name="identification"
                value={newProduct.identification}
                onChange={handleChange}
            />
            <label>Estado</label>
            <input 
                type="checkbox"
                checked={newProduct.active}
                onChange={()=>setnewProduct({...newProduct, active: !newProduct.active})}
            />            
            <label htmlFor="category">Categoría</label>
            <input
                id="category"
                list="product-categories"
                value={newProduct.category}
                onChange={(e) =>
                    setnewProduct({
                        ...newProduct,
                        category: e.target.value
                    })
                }
                placeholder="Escribí o elegí una categoría"
            />

            <datalist id="product-categories">
                {categories.map((category) => (
                    <option key={category} value={category} />
                ))}
            </datalist>
            <label> Foto </label>
            {newProduct.photos[0] ? (
                <div className={Styles.photoContainer}>
                    <img 
                        src={newProduct.photos[0]}
                        alt="Foto del producto"
                        
                    />
                    <FontAwesomeIcon 
                            icon={faX}
                            className={Styles.faXicon}  
                            onClick={handleDeleteImage}
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
            {newProduct.photos[1] ? (
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
                    <label>Cargar objeto 3D (.obj)</label>

                    <input
                        type="file"
                        accept=".obj"
                        disabled={uploadingObj}
                        onChange={handleUploadR2}
                    />

                    {uploadingObj && <p>Subiendo modelo a R2...</p>}
                </div>
            )}
            <button onClick={handleSubmit}>Crear producto</button>
        </div>
    )
}