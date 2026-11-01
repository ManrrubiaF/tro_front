
import axios from "axios";
import Styles from './ProductDetail.module.css'
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../Utils/Redux/Hooks";
import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateProduct } from "../../../Utils/Redux/productSlice";
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

export default function ProductDetailDash() {

    const navigate = useNavigate()
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY
    const UPLOAD_PRESET = import.meta.env.VITE_PRESET
    const BACK_URL = import.meta.env.VITE_API_URL;
    const userData = useAppSelector((state) => state.user)
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [uploadingObj, setUploadingObj] = useState(false);
    const [updatingProduct, setUpdatingProduct] = useState(false);
    const [toast, setToast] = useState({
        message: "",
        type: ""
    });

    const products = useAppSelector((state) => state.products.products);

    const categories = [
        ...new Map(
            products
                .map(product => product.category.trim())
                .filter(Boolean)
                .map(category => [category.toLowerCase(), category])
        ).values()
    ];

    const productToShow = useAppSelector((state) =>
        state.products.products.find(product => product.id === Number(id))
    );

    const [productModified, setProductModified] = useState<Product>({
        id: productToShow!.id,
        name: productToShow!.name,
        description: productToShow!.description,
        photos: productToShow!.photos,
        identification: productToShow!.identification,
        category: productToShow!.category,
        active: productToShow!.active,
    });

    useEffect(() => {
        if (!toast.message) return;

        const timeout = setTimeout(() => {
            setToast({ message: "", type: "" });
        }, 3000);

        return () => clearTimeout(timeout);
    }, [toast]);

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

    const handleChange = (
        event: ChangeEvent<HTMLTextAreaElement> |
        ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        if (event.target instanceof HTMLTextAreaElement) {
            setProductModified({
                ...productModified,
                [name]: value
            });
        } else if (event.target instanceof HTMLInputElement) {
            setProductModified({
                ...productModified,
                [name]: value,
            })
        }
    }

    const handleSubmit = async () => {
        if (updatingProduct) return;

        try {
            setUpdatingProduct(true);

            setToast({
                message: "Actualizando producto...",
                type: "info"
            });

            const category = productModified.category.trim();

            const normalizedCategory = categories.find(
                existing => existing.toLowerCase() === category.toLowerCase()
            );

            const productToUpdate = {
                ...productModified,
                category: normalizedCategory ?? category
            };

            const response = await axios.put(
                `${BACK_URL}/product/update/${id}`,
                productToUpdate,
                {
                    headers: {
                        authorization: `Bearer ${userData?.token}`
                    }
                }
            );

            dispatch(updateProduct(response.data));

            setProductModified(response.data);

            setToast({
                message: "Producto actualizado correctamente",
                type: "success"
            });

        } catch (error) {
            console.error(error);

            setToast({
                message: "No se pudo actualizar el producto",
                type: "error"
            });

        } finally {
            setUpdatingProduct(false);
        }
    };

    const handleImage = (imageUpdate: string) => {
        setProductModified({
            ...productModified,
            photos: [imageUpdate, productModified.photos[1]]
        })
    }

    const handleDeleteImage = () => {
        setProductModified({
            ...productModified,
            photos: ["", productModified.photos[1]]
        })
    }

    const handleDeleteObj = async () => {
        const publicUrl = productModified.photos[1];

        if (!publicUrl) return;

        try {
            await axios.delete(`${BACK_URL}/r2/delete`, {
                data: { publicUrl },
                headers: {
                    authorization: `Bearer ${userData?.token}`,
                },
            });

            setProductModified(prev => ({
                ...prev,
                photos: [prev.photos[0] ?? "", ""],
            }));

            setToast({
                message: "Modelo 3D eliminado correctamente",
                type: "success"
            });

        } catch (error) {
            console.error("Error al eliminar el objeto de R2:", error);

            setToast({
                message: "No se pudo eliminar el modelo 3D",
                type: "error"
            });
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

            setProductModified(prev => ({
                ...prev,
                photos: [prev.photos[0] ?? "", urlObj],
            }));

            setToast({
                message: "Modelo 3D subido correctamente",
                type: "success"
            });

        } catch (error) {
            console.error("Error al subir el modelo a R2:", error);

            setToast({
                message: "No se pudo subir el modelo 3D",
                type: "error"
            });

        } finally {
            setUploadingObj(false);
            event.target.value = "";
        }
    };

    return (
        <div className={Styles.divMayor}>

            {toast.message && (
                <div className={`${Styles.toast} ${Styles[toast.type]}`}>
                    {toast.message}
                </div>
            )}

            <label>Nombre:</label>
            <input
                name="name"
                value={productModified.name}
                onChange={handleChange}
            />

            <label>Descripción</label>
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
                onChange={() => setProductModified({
                    ...productModified,
                    active: !productModified.active
                })}
            />

            <label htmlFor="category">Categoría</label>
            <input
                id="category"
                name="category"
                list="product-categories"
                value={productModified.category}
                onChange={handleChange}
                placeholder="Escribí o elegí una categoría"
            />

            <datalist id="product-categories">
                {categories.map(category => (
                    <option key={category} value={category} />
                ))}
            </datalist>

            <label>Foto</label>

            {productModified.photos[0] ? (
                <div className={Styles.photoContainer}>
                    <img
                        src={productModified.photos[0]}
                        alt="Foto del producto"
                    />

                    <FontAwesomeIcon
                        icon={faX}
                        className={Styles.faXicon}
                        onClick={handleDeleteImage}
                    />
                </div>
            ) : (
                <div className={Styles.inputContainerPhoto}>
                    <input
                        className={Styles.fileUpload}
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (file) {
                                upload(file).then(
                                    (imageUpdate) => {
                                        handleImage(imageUpdate)
                                    }
                                ).catch((error) => {
                                    console.error(error)
                                })
                            }
                        }}
                    />
                </div>
            )}

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
            ) : (
                <div className={Styles.uploadObj}>
                    <label>Cargar Objeto</label>

                    <input
                        type="file"
                        accept=".obj"
                        disabled={uploadingObj}
                        onChange={handleUploadR2}
                    />

                    {uploadingObj && <p>Subiendo modelo a R2...</p>}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={updatingProduct || uploadingObj}
            >
                {updatingProduct ? "Actualizando..." : "Actualizar"}
            </button>

            <button onClick={() => navigate(-1)}>
                Volver
            </button>

        </div>
    )
}
