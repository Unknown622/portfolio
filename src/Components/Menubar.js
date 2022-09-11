import React, {useEffect, useRef, useState} from "react"
import "../Style/Menubar.css"
import Typography from "@mui/material/Typography"
import ToolTip from "./ToolTip";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

const NAME = "VINCENT ZIMMER"
const PHONE_NUMBER = "(763) 301-2865"
const EMAIL = "vlz12@yahoo.com"

export default function Menubar(props) {
    const PAGES = [{"title": 'About Me', "scroll": props.topRef},
        {"title": 'Experience', "scroll": props.experienceRef},
        {"title": 'Connect', "scroll": props.footerRef}]
    const SHOW_MOBILE_MENU = " menu-mobile-active"
    const menuRef = useRef()
    const [mobileMenu, setMobileMenu] = useState("")

    // Hide mobile menu when window is resized
    useEffect(() => {
        if (mobileMenu !== "") {
            // Add window resize listener when mobile menu is open
            window.addEventListener('resize', closeMobileMenu)
        }
    }, [mobileMenu])

    // Toggles mobile menu
    function toggleMobileMenu(event) {
        if (event.target.checked) {
            setMobileMenu(SHOW_MOBILE_MENU) // Open menu
        } else {
            setMobileMenu("") // Close menu
        }
    }

    // Auto scrolls to input ref
    function scrollTo(ref) {
        closeMobileMenu()
        ref.current.scrollIntoView({behavior: 'smooth', block: 'start'})
    }

    // Closes mobile menu
    function closeMobileMenu() {
        setMobileMenu("")
        menuRef.current.checked = false
    }

    return (
        <div className={"menubar" + mobileMenu}>
            <div className="menubar-menu-toggle menubar-mobile">
                <input type="checkbox" style={{display: "none"}} id="menubar-menu-toggle"
                       onChange={toggleMobileMenu} ref={menuRef}/>
                <label htmlFor="menubar-menu-toggle" className="hamburger">
                        <span className="bun bun-top">
                            <span className="bun-crust bun-crust-top"/>
                        </span>
                    <span className="bun bun-bottom">
                            <span className="bun-crust bun-crust-bottom"/>
                        </span>
                </label>
            </div>
            <Typography className="menubar-logo" variant="h5" noWrap
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none'
                        }}
            >
                {NAME}
            </Typography>
            <nav className={"menubar-buttons" + mobileMenu}>
                {PAGES.map((page, index) =>
                    <button key={index} className={mobileMenu === "" ? "menubar-button" : "menubar-button pop-in"}
                            style={{animationDelay: 0.25 + (index / 4) + "s"}} onClick={() => {scrollTo(page["scroll"])}}>
                        {page["title"]}
                    </button>
                )}
            </nav>
            <div className={"menubar-contact" + mobileMenu}>
                <ToolTip containerClass={mobileMenu === "" ? "menubar-contact-copy" : "menubar-contact-copy pop-in"}
                         title={"Copy to clipboard"} clipboard={PHONE_NUMBER} placement={"left"}>
                    <LocalPhoneRoundedIcon/>
                    <Typography variant="subtitle2" style={{marginLeft: "0.25rem"}}>
                        {PHONE_NUMBER}
                    </Typography>
                </ToolTip>
                <ToolTip containerClass={mobileMenu === "" ? "menubar-contact-copy" : "menubar-contact-copy pop-in"}
                         overrideY={mobileMenu === "" || window.innerWidth > 550 ? undefined : -2}
                         title={"Copy to clipboard"} clipboard={EMAIL} placement={"left"}>
                    <EmailRoundedIcon/>
                    <Typography variant="subtitle2" style={{marginLeft: "0.25rem"}}>
                        {EMAIL}
                    </Typography>
                </ToolTip>
            </div>
        </div>
    )
}