import logo from "../images/logo.svg";
import {Link, NavLink} from 'react-router-dom';

const Footer = () =>{
  return(
  <>
    <div className="Footer">
        <div className="container">
            <div className="Footer__inner">
                <div className="Footer__content">
                    <div className="Footer__content-item">
                        <Link className='Footer__logo-link' to='/'>
                            <div className="Footer__logo-box">
                                <img className="Footer__logo-img" src={logo} alt='logo'/>
                            </div>
                        </Link>
                    </div>
                    <div className="Footer__content-item">
                        <h1 className="Footer__content-item__title">Навигация</h1>
                        <ul className="Footer__content-item__list">
                            <li className="Footer__content-item__list-item">
                                <NavLink className="Footer__content-item__link" to='/'>Главная</NavLink>
                            </li>
                            <li className="Footer__content-item__list-item">
                                <NavLink className="Footer__content-item__link" to='/news'>Новости</NavLink>
                            </li>
                            <li className="Footer__content-item__list-item">
                                <NavLink className="Footer__content-item__link" to='/about'>О платформе</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="Footer__content-item">
                        <h1 className="Footer__content-item__title">Программные решения</h1>
                        <ul className="Footer__content-item__list">
                            <li className="Footer__content-item__list-item">«Цифровое управление объектами РСО»</li>
                            <li className="Footer__content-item__list-item">«Единая распределенная диспетчерская службы на примере Орловской области»   </li>
                            <li className="Footer__content-item__list-item">«МКД износ»</li>
                            <li className="Footer__content-item__list-item">«ЭкспертРасчет»</li>
                        </ul>
                    </div>
            
                </div>
                <div className="Footer__copy">
                    <p className="Footer__copy-text">© 2022 «ЭРА ЖКХ»</p>
                </div>
            </div>
        </div>
    </div>

    </>
  )
}
export default Footer;