
import { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home/Home'
import Products from './Components/Products/Products'
import { useAppDispatch } from './Utils/Redux/Hooks'
import axios from 'axios'
import { setProducts, setProductToShow } from './Utils/Redux/productSlice'
import ProductDetail from './Components/ProductsDetails/ProductDetail'
import Customized from './Components/Customized/Customized'
import Dashboard from './Components/Dashboard/Dashboard'
import ProductDetailDash from './Components/Dashboard/ProductDetail/ProductDetail'

type Product = {
    id: number;
    name: string;
    description: string;
    category: string;
    photos: string[];
    identification: string;
    active: boolean;
}

function App() {

  const dispatch = useAppDispatch()
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(()=>{
    document.title = 'Tu Regalo Original';
    const getProducts = async ()=>{
      const response = await axios.get<Product[]>(`${apiUrl}/product/all`)
      dispatch(setProducts(response.data))
      const activeProducts = response.data.filter(p => p.active && p.identification === '')
      dispatch(setProductToShow(activeProducts))
    }

    getProducts()


  },[])
  

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} Component={Home} /> 
        <Route path='/products' element={<Products />} Component={Products} />
        <Route path='/productDetail/:id' element={<ProductDetail />} Component={ProductDetail} />
        <Route path='/personalizados' element={<Customized />} Component={Customized} />
        <Route path='/dash' element={<Dashboard />}  Component={Dashboard} />
        <Route path='/dash/detail/:id' element={< ProductDetailDash />}  Component={ProductDetailDash} />
        
      </Routes>
    </div>
  )
}

export default App
