import React, {useCallback, useEffect, useRef, useState} from "react"
import "../Style/Menubar.css"
import Typography from "@mui/material/Typography"
import ToolTip from "./ToolTip"
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded"
import EmailRoundedIcon from "@mui/icons-material/EmailRounded"
import ScrollProgress from "./ScrollProgress"

const NAME = "VINCENT ZIMMER"
const PHONE_NUMBER = "(763) 301-2865"
const EMAIL = "vlz12@yahoo.com"

export default function Menubar(props) {
    const [buttons, updateButtons] = useState([{"title": 'About Me', "scroll": props.topRef, "ref": useRef()},
        {"title": 'Experience', "scroll": props.experienceRef, "ref": useRef()},
        {"title": 'Connect', "scroll": props.footerRef, "ref": useRef()}])
    const LOGO_STYLE = {
        fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.3rem',
        color: 'white', textDecoration: 'none'
    }
    const SHOW_MOBILE_MENU = " menu-mobile-active"
    const menuRef = useRef()
    const logoRef = useRef()
    const [mobileMenu, setMobileMenu] = useState("")

    // Toggles mobile menu
    const toggleMobileMenu = useCallback((show) => {
        if (show && mobileMenu === "") { // Open menu
            // Update animation delay
            let newButtons = buttons
            newButtons.forEach((button, index) => {
                button["ref"].current.style.animationDelay = (0.25 + (index / 4)) + "s"
            })
            updateButtons(newButtons)
            setMobileMenu(SHOW_MOBILE_MENU)
            menuRef.current.checked = true
        } else if (!show && mobileMenu === SHOW_MOBILE_MENU) { // Close menu
            // Update animation delay
            let newButtons = buttons
            newButtons.forEach((button, index) => {
                button["ref"].current.style.animationDelay = (((buttons.length - index) * 90) - 90) + "ms"
            })
            updateButtons(newButtons)
            setMobileMenu("")
            menuRef.current.checked = false
        }
    }, [buttons, mobileMenu])

    // Hide mobile menu when window is resized
    useEffect(() => {
        if (mobileMenu !== "") {
            // Add window resize listener when mobile menu is open
            window.addEventListener('resize', () => {
                toggleMobileMenu(false)
            })
        }
    }, [mobileMenu, toggleMobileMenu])

    // Auto scrolls to input ref
    function scrollTo(ref) {
        toggleMobileMenu(false)
        ref.current.scrollIntoView({behavior: 'smooth', block: 'start'})
    }

    return (
        <header className="menubar-container">
            <div className={"menubar" + mobileMenu}>
                <div className="menubar-menu-toggle menubar-mobile">
                    <input type="checkbox" style={{display: "none"}} id="menubar-menu-toggle" ref={menuRef}
                           onChange={(event) => {
                               toggleMobileMenu(event.target.checked)
                           }}/>
                    <label htmlFor="menubar-menu-toggle" className="hamburger">
                        <span className="bun bun-top">
                            <span className="bun-crust bun-crust-top"/>
                        </span>
                        <span className="bun bun-bottom">
                            <span className="bun-crust bun-crust-bottom"/>
                        </span>
                    </label>
                </div>
                <Typography className="menubar-logo" variant="h5" noWrap sx={LOGO_STYLE} ref={logoRef}
                            onClick={() => {scrollTo(buttons[0]["scroll"])}}
                            style={{left: (logoRef.current ? "calc(50.25% - "
                                    + (logoRef.current.getBoundingClientRect().width / 2)+"px)"
                                    : "calc(50.25% - 101px")}}>
                    {NAME}
                </Typography>
                <nav className={"menubar-buttons" + mobileMenu}>
                    {buttons.map((button, index) =>
                        <button className={mobileMenu === "" ? "menubar-button pop-out" : "menubar-button pop-in"}
                                key={index} ref={button["ref"]} onClick={() => {
                            scrollTo(button["scroll"])
                        }}>
                            {button["title"]}
                        </button>
                    )}
                </nav>
                <div className={"menubar-contact" + mobileMenu + (mobileMenu === "" ? " pop-out" : " pop-in")}>
                    <ToolTip title={"Copy to clipboard"} clipboard={PHONE_NUMBER} placement={"left"}
                        containerClass={mobileMenu === "" ? "menubar-contact-copy pop-out" : "menubar-contact-copy pop-in"}>
                        <LocalPhoneRoundedIcon/>
                        <Typography variant="subtitle2" style={{marginLeft: "0.25rem"}}>
                            {PHONE_NUMBER}
                        </Typography>
                    </ToolTip>
                    <ToolTip title={"Copy to clipboard"} clipboard={EMAIL} placement={"left"}
                        containerClass={mobileMenu === "" ? "menubar-contact-copy pop-out" : "menubar-contact-copy pop-in"}>
                        <EmailRoundedIcon/>
                        <Typography variant="subtitle2" style={{marginLeft: "0.25rem"}}>
                            {EMAIL}
                        </Typography>
                    </ToolTip>
                </div>
            </div>
            <ScrollProgress/>
        </header>
    )
}