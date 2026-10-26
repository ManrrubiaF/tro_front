
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./NavBar.module.css";
import logo from "../../assets/Logo TRO.png";

export default function NavBar() {
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const irA = (ruta: string) => {
        navigate(ruta);
        setMenuAbierto(false);
    };

    return (
        <header className={Styles.divMayor}>
            <img
                src={logo}
                className={Styles.logo}
                alt="Tu Regalo Original"
                onClick={() => irA("/")}
            />

            <h1>Tu Regalo Original</h1>

            <button
                type="button"
                className={Styles.menuButton}
                aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuAbierto}
                onClick={() => setMenuAbierto(!menuAbierto)}
            >
                <span />
                <span />
                <span />
            </button>

            <nav
                className={`${Styles.divContainer} ${
                    menuAbierto ? Styles.menuAbierto : ""
                }`}
            >
                <p
                    className={Styles.pOptions}
                    onClick={() => irA("/")}
                >
                    Home
                </p>

                <p
                    className={Styles.pOptions}
                    onClick={() => irA("/products")}
                >
                    Productos
                </p>

                <p
                    className={Styles.pOptions}
                    onClick={() => irA("/personalizados")}
                >
                    Personalizados
                </p>
            </nav>
        </header>
    );
}
