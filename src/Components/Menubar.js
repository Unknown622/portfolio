import React, {useRef, useState} from "react"
import Typography from '@mui/material/Typography'
import "../Style/Menubar.css"
import {Box, Stack, Tooltip} from "@mui/material"
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'

function Contact(props) {
    let [copySuccess, setCopySuccess] = useState(false)

    // Sets timeout with input delay
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    return (
        <Tooltip title={copySuccess === true ? "Success" : "Copy to clipboard"} placement="left" onClick={() => {
            navigator.clipboard.writeText(props.text).then(async () => {
                setCopySuccess(true)
                await timeout(2000)
                setCopySuccess(false)
            })
        }} className="contact-copy"
        >
            <Stack direction="row" alignItems="center">
                {props.children}
                <Typography variant="subtitle2" style={{marginLeft: "0.4rem"}}>
                    {props.text}
                </Typography>
            </Stack>
        </Tooltip>
    )
}

export default function Menubar(props) {
    const PAGES = [{"title": 'About Me', "scroll": props.topRef}, {"title": 'Experience', "scroll": props.experienceRef},
        {"title": 'Connect', "scroll": props.footerRef}]
    const PHONE_NUMBER = "(763) 301-2865"
    const EMAIL = "vlz12@yahoo.com"
    const NAME = "VINCENT ZIMMER"
    const SHOW_MOBILE_MENU = " menu-mobile"
    let [mobileMenu, setMobileMenu] = useState("")
    let menuRef = useRef()
    const logo = <div className="menubar-logo">
        <Typography variant="h5" noWrap
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
    </div>
    const contact = <div className={mobileMenu === "" ? "menubar-contact" : "menubar-contact pop-in"}>
        <Contact text={PHONE_NUMBER}><LocalPhoneRoundedIcon/></Contact>
        <Contact text={EMAIL}><EmailRoundedIcon/></Contact>
    </div>
    const buttons = PAGES.map((page, index) =>
        <button key={index} className={"menubar-button"} onClick={() => {scrollTo(page["scroll"])}}>
            {page["title"]}
        </button>
    )

    // Auto scrolls to input ref
    function scrollTo(ref) {
        setMobileMenu("")
        menuRef.current.checked = false
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Toggles mobile menu
    function toggleMobileMenu(event) {
        // Open menu
        if (event.target.checked) {
            setMobileMenu(SHOW_MOBILE_MENU)
        }
        // Close menu
        else {
            setMobileMenu("")
        }
    }

    return (
        <span className={"menubar" + mobileMenu}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="menubar-grid">
                <div className="desktop">
                    <Stack spacing={2} justifyContent="flex-start" alignItems="center" direction="row">
                        {logo}
                        <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center"
                               className="menubar-buttons">
                            {buttons}
                        </Stack>
                    </Stack>
                </div>
                <div className="menubar-menu-toggle mobile">
                    <input type="checkbox" style={{display: "none"}} id="menubar-menu-toggle"
                           onChange={toggleMobileMenu} ref={menuRef} />
                    <label htmlFor="menubar-menu-toggle" className="hamburger">
                        <span className="bun bun-top">
                            <span className="bun-crust bun-crust-top"/>
                        </span>
                        <span className="bun bun-bottom">
                            <span className="bun-crust bun-crust-bottom"/>
                        </span>
                    </label>
                </div>
                <Box className="mobile">
                    {logo}
                </Box>
                <Box className="spacer"/>
                {contact}
            </Stack>
            <div id="menu-mobile" className={mobileMenu}>
                {contact}
                <Stack direction="column" justifyContent="space-evenly" alignItems="flex-start" spacing={1}
                       className="menubar-buttons">
                    {PAGES.map((page, index) =>
                        <button key={index} className={mobileMenu === "" ?
                            "menubar-button" + mobileMenu
                            : "menubar-button pop-in" + mobileMenu}
                                style={{animationDelay: 0.25 + (index / 4) + "s"}}
                            onClick={() => {scrollTo(page["scroll"])}}>
                            {page["title"]}
                        </button>
                    )}
                </Stack>
            </div>
        </span>
    )
}