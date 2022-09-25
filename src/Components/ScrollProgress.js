import React, {useEffect, useState} from "react"

export default function ScrollProgress() {
    const [progress, setProgress] = useState("0")
    const STYLE = {
        background: "white", height: "0.075rem", borderRadius: "5px", margin: "0 auto 0 auto",
        width: progress, zIndex: "1001"
    }

    // Add scroll listener
    useEffect(() => {
        // Update scroll bar on scroll
        window.addEventListener("scroll", () => {
            const scrollTotal = document.documentElement.scrollTop
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
            setProgress((scrollTotal / height * 100) + "%")
        })
    }, [])

    return (
        <div style={STYLE}/>
    )
}