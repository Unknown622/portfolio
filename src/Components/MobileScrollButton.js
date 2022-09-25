import React from "react"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function MobileScrollButton() {

    return(
        <div className="mobile-scroll-button elevated" title="Scroll to top"
             onClick={() => {window.scrollTo({top: 0, left: 0, behavior: "smooth"})}}>
            <center><KeyboardArrowUpIcon /></center>
        </div>
    )
}