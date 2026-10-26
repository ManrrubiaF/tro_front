import Styles from './Products.module.css'
import { useAppDispatch, useAppSelector } from '../../Utils/Redux/Hooks'
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetState, setCategory } from '../../Utils/Redux/filterSlice';
import  Pagination  from '../Pagination/Pagination'
import NavBar from '../NavBar/NavBar';


type Product = {
    id: number;
    name: string;
    description: string;
    category: string;
    photos: string[];
    active: boolean;
}

export default function Products(){

    const dispatch = useAppDispatch()
    const [ allProduct, setAllProduct ] = useState<Product[]>([]) //products To Render
    const { elementsPerPage, currentPage } = useAppSelector((state) => state.pagination)
    const filter = useAppSelector((state) => state.filter)
    const navigate = useNavigate();
    const productsToShow = useAppSelector((state)=> state.products.productToShow) //onlyActiveProducts
    const categories = [...new Set(productsToShow.map(products => products.category))]

    


    //Filter//

    const handleFilters = () => {
        let productsFiltered: Product[] = productsToShow!.slice()

        if (filter.category !== '') {
            productsFiltered = productsToShow!.filter(oneProduct => oneProduct.category === filter.category);
        }

        setAllProduct(productsFiltered);
    };

    const handleClear = () => {
        dispatch(resetState());
        if(productsToShow.length > 0){
            setAllProduct(productsToShow)            
        }
    }

    
    const startIndex = (currentPage - 1) * elementsPerPage;
    const endIndex = currentPage * elementsPerPage;
    const productsOnPage: Product[] = allProduct.slice(startIndex, endIndex);

    useEffect(() => {
        handleFilters();
    }, [filter.category, filter.order])

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        dispatch(setCategory(value))

    }
    

    const handleDetailClick = (id: number) => {
        navigate(`/productDetail/${id}`)
    }


    

    return(
        <div className={Styles.divMayor}>
            <NavBar />
            <div className={Styles.filterDiv}>
                <select name="Category" onChange={handleCategoryChange} value={filter.category}>
                    <option value="" disabled > Filtrar por categoria </option>
                    {categories && (
                        categories.map((oneCategory, index) => (
                            <option key={index} value={oneCategory}>{oneCategory}</option>
                        ))
                    )}

                </select>
                <button onClick={handleClear}> Borrar filtros</button>
            </div>
            <div className={Styles.productsContainer}>
                {productsOnPage.map((product) => (
                    <div className={Styles.oneProduct} key={product.id} onClick={() => handleDetailClick(product.id)} >
                        <div className={Styles.imageContainer}>
                                <img className={Styles.Showimg} src={product.photos[0]} alt="Product image" />
                        </div>
                        <label className={Styles.labelProduct}>{product.name}</label>
                        
                    </div>
                ))}
            </div>
            <Pagination />
            
        </div>
        
    )
}