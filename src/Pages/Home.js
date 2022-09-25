import React, {useCallback, useEffect, useRef} from 'react'
import "../Style/Home.css"
import AboutMe from "../Sections/About Me.js"
import Experience from "../Sections/Experience"
import Footer from "../Components/Footer"
import {Container} from "@mui/material"
import Menubar from "../Components/Menubar"
import MobileScrollButton from "../Components/MobileScrollButton"
import {saveAs} from "file-saver"
import Resume from '../Resume.pdf'

export default function Home() {
    let footerRef = useRef()
    let topRef = useRef()
    let experienceRef = useRef()

    // Get scroll refs for menubar
    const getFooterScroll = useCallback((data) => {
        footerRef.current = data
    }, [])

    const getExperienceRef = useCallback((data) => {
        experienceRef.current = data
    }, [])

    // Download resume when using control + P
    useEffect(() => {
        // Add print listener
        window.addEventListener("beforeprint", () => {
            saveAs(Resume, "Resume.pdf")
        })
    }, [])

    return (
        <>
            <Menubar footerRef={footerRef} topRef={topRef} experienceRef={experienceRef}/>
            <Container className="content" ref={topRef}>
                <AboutMe>
                    I have over a year of professional experience as a Software Engineer at Ecumen where I
                    worked on ABXTracker. I started at Ecumen as an intern working on ABXTracker but when the internship
                    finished they decided to keep me on part-time while I was still in school. ABXTracker is used in
                    nursing homes to track infections as well as antibiotic and drug use. I mostly fixed bugs,
                    applied enhancements, and implemented new features.
                    <br/>
                    While working at Ecumen I also completed my capstone at Saint Cloud State University where I
                    worked as part of a team in an agile environment as well as communicating directly with the
                    stakeholders. My team was tasked with creating a web app that used machine learning to count
                    vehicles on a road and get the road condition by using a camera.
                </AboutMe>
                <Experience getScroll={getExperienceRef}/>
            </Container>
            <MobileScrollButton />
            <Footer getScroll={getFooterScroll}/>
        </>
    )
}