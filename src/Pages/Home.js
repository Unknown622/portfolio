import React, {useCallback, useEffect, useRef, useState} from 'react'
import "../Style/Home.css"
import Menubar from "../Components/Menubar.js"
import AboutMe from "../Sections/About Me.js"
import Experience from "../Sections/Experience"
import Footer from "../Components/Footer";
import {Container, debounce} from "@mui/material"

export default function Home() {
    const PLAY_GRADIENT = "gradient"
    const PAUSE_GRADIENT = PLAY_GRADIENT + " paused"
    let [gradient, setGradient] = useState(PAUSE_GRADIENT)
    let footerRef = useRef()
    let topRef = useRef()
    let experienceRef = useRef()

    useEffect(() => {
        // Add scroll listener
        // Start gradient on scroll
        window.addEventListener("scroll", () => {setGradient(PLAY_GRADIENT)})
        // Add scroll stop listener
        // Pause gradient on scroll stop
        window.addEventListener('scroll', debounce(() => {setGradient(PAUSE_GRADIENT)}, 500))
    })

    // Get scroll refs for menubar
    const getFooterScroll = useCallback((data) => {
        footerRef.current = data
    }, [])

    const getExperienceRef = useCallback((data) => {
        experienceRef.current = data
    }, [])

    return (
        <div className={"content " + gradient} ref={topRef}>
            <Menubar footerRef={footerRef} topRef={topRef} experienceRef={experienceRef} />
            <Container  style={{paddingTop: "4rem", animationFillMode: "both"}}>
                <AboutMe>
                    I have about a year of professional experience as a software engineer at Ecumen where I
                    worked on ABXTracker. I started at Ecumen as an intern working on ABXTracker but when the internship
                    was over they decided to keep me on part-time while I was still in school. ABXTracker is used in
                    nursing
                    homes to track infections as well as antibiotic and drug use. I mostly fixed bug, made enhancements,
                    and added new features.
                    <br/>
                    While working at Ecumen I also completed my capstone at St. Cloud State University where I
                    worked as part of a group in an agile environment as well as communicating directly with the
                    stakeholders. For this project my group was tasked with creating a web app that used machine
                    learning to count vehicles on a road and get the road condition by using a camera.
                </AboutMe>
                <Experience getScroll={getExperienceRef} />
            </Container>
            <Footer getScroll={getFooterScroll} />
        </div>
    )
}