import React, {userState, useEffect} from "react";
import {Link} from 'react-router-dom';
import logo from './assets/logo/png';
function Header(){
    const [active, setActive] =useState(false);
    const [showCountryDropdown, setShowCountryDropdown]= userState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const category = ["business", "entertainment", "general", "health", "science", "sports", "technology","politics"];
    return(
        <header>
            <nav className="fixed top-0 left-0 w-full h-auto bg-grey-800 z-10 flex items-center justify-around">
                <h3 className="relative heading font-bold md:basis-1/6 text-2xl xs:basis-4/12 z-50 md-5">
                <span className="logo">
                    <img src="{logo}" alt="News_Aggregator"/>
                </span>
                </h3>
                <ul className={active ? "nav-ul flex gap-11 md:gap-14 xs:gap-12 lg:basis-3/6 md:basis-4/6 md:justify-end active" : " nav-ul flex gap-14 lg:basis-3/6 md:basis-4/6 justify-end"}>
                    <li><Link className="no-underline font-semibold" to="/" onClick={() => { setActive(!active) }}>
                        All News
                        </Link>
                    </li>
                    <li className="dropdown-li">
                        <Link className="no-underline font-semibold flex items-center gap-2" onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowCountryDropdown(false) }}>Top-Headlines <FontAwesomeIcon className={showCategoryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"} icon={faCircleArrowDown} />
                        Top-Headlines
                        </Link>
                    </li>

                    <ul className={showCategoryDropdown ? "dropdown p-2 show-dropdown" :" dropdown p-2"}>
                        {Countries.map((element, index)=>(
                            <li key={index} onClick={()=>showCategoryDropdown(!showCountryDropdown)}>
                                <Link to={`/country/${element?.iso_2_aplha}`} className="flex gap-3" on>
                                <img src="{element?.png}" srcset={`https://flagcdn.com/32x24/${element?.ios_2_alpha}.png 2x`} alt="element?.countryName" />
                                <span>{element?.countryName}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <li>
                        <Link className="no-underline font-semmibold"to ="#" onclick={toggleTheme}>
                        <input type="checkbox" className="checkbox" id="checkbox" />
                        <label for="checkbox" class="checkbox-label">
                        <i class="fas fa-moon"></i>
                        <i class="fas fa-sun"></i>
                        <span class="ball"></span>
                        </label>
                        </Link>
                    </li>
                    <li></li>
                </ul>
            </nav>
        </header>
    );
} 