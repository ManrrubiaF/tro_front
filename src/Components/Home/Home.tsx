import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../../Utils/Redux/Hooks'
import { setAbout } from '../../Utils/Redux/aboutSlice'
import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'
import { useEffect } from 'react'
import Styles from './Home.module.css'

export default function Home (){

    const dispatch = useAppDispatch()
    const aboutData = useAppSelector((state) => state.about)
    const apiUrl = import.meta.env.VITE_API_URL;

    const getAbout = async () => {
        try {
            const response = await axios.get(`${apiUrl}/about/all`)
            dispatch(setAbout(response.data))
        } catch (error) {
            console.error(error)
            
        }
    }

    useEffect(()=>{
        getAbout()
    },[])

    console.log(aboutData)
    
    return (
        <div className={Styles.divMayor}>
            <NavBar />
            <div className={Styles.divContainer}>
                <h1> Sobre Nosotros </h1>
                <p>{aboutData[0]?.text}</p>
            </div>
            <Footer />
        </div>
    )
}