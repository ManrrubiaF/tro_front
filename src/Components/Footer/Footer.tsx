import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import Styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={Styles.Footer}>
            <div className={Styles.contactInfo}>
                <span>
                    <FontAwesomeIcon icon={faPhone} />
                    11-3171-8193
                </span>

                <span>
                    <FontAwesomeIcon icon={faEnvelope} />
                    turegalo.original.023@gmail.com
                </span>
            </div>

            <a
                className={Styles.whatsapp}
                href="https://wa.link/1ck6i3"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar a Tu Regalo Original por WhatsApp"
            >
                <FontAwesomeIcon icon={faWhatsapp} />
                WhatsApp
            </a>
        </footer>
    )
}