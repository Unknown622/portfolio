import React, {useEffect, useRef} from 'react'
import "../Style/Experience.css"
import Header from "../Components/Header";
import {Container, Grid, Typography} from "@mui/material"
import TimelineYear from "../Components/Timeline Year"
import TimelineItem from "../Components/Timeline Item"
import TimelineProject from "../Components/Timeline Project"

const languages = ["React (1 year)", "JavaScript (2 years)", "ES6 (1 year)", "Java (5 years)", "HTML (2 years)",
    "CSS (2 years)", "SQL (2 years)", "Node (1 year)", "Flutter (1 year)", "PHP (1 year)", "C++ (2 years)",
    "JQuery (1 year)", "Python (2 years)", "JSON (1 year)", "XML (2 years)"]
const skills = ["Agile", "AJAX", "Android", "Android Studio", "API", "Eclipse", "Figma", "GitHub", "Google Suite",
    "IntelliJ IDEs", "iOS", "Jira", "Linux", "MacOS", "MaterialUI", "Microsoft Office", "Swing GUI", "Tensorflow",
    "UML", "VS Code", "Windows", "Wordpress", "Xcode", "Zoom"]

export default function Experience(props) {
    let scrollRef = useRef()

    // Send scroll ref for menubar to parent
    useEffect(() => {
        props.getScroll(scrollRef.current)
    }, [props])

    return (
        <section className={"section"} ref={scrollRef}>
            <Header>Experience</Header>
            <Container maxWidth="lg" className="timeline">
                <TimelineYear>2022</TimelineYear>
                <TimelineItem title={"Part-Time Software Engineer at Ecumen"} date={"Sep 2021 to Present"}>
                    Work on proprietary ABXTracker website for long-term healthcare facilities which enables users to
                    track patient antibiotics and infections
                    <br/>Languages/Tools: Wordpress, HTML, JavaScript, CSS, PHP, SQL
                </TimelineItem>
                <TimelineProject title={"This Website"} date={"Jul 2022"}
                                 gitURL={"https://github.com/Unknown622/portfolio"}>
                    Languages/Tools: React, ES6, MaterialUI
                </TimelineProject>
                <TimelineItem title={"Graduated at SCSU"} date={"Jul 2022"}>
                    Graduated at Saint Cloud State University with a bachelor's degree in Software Engineering
                </TimelineItem>
                <TimelineProject title={"Capstone at SCSU"} date={"Aug 2021 to May 2022"}>
                    Part of an agile team that developed a desktop and mobile website that counted and classified
                    vehicles on a road and obtained road conditions using a camera for Upper Great Plains Transportation
                    Institute at NDSU
                    <br/>Languages/Tools: React, Python, ES6, Tensorflow
                </TimelineProject>
                <TimelineProject title={"Netflix Recommender"} date={"Fall 2021"}>
                    Part of team for Data Mining course which made a website that recommended Netflix titles based off
                    the similarity of descriptions in a dataset
                    Languages/Tools: HTML, JavaScript, CSS, Python, Flask
                </TimelineProject>
                <TimelineItem title={"Intern Software Engineer at Ecumen"} date={"Jun 2021 to Sep 2021"}/>
                <TimelineProject title={"Emoji Translator"} date={"Spring 2022"}
                                 gitURL={"https://github.com/Unknown622/Emoji-Translator"}>
                    Part of team for Human Computer Interaction course that made an Android app that translated
                    text to emojis with an emphasis on frontend
                    <br/>Languages/Tools: Java, AndroidStudio
                </TimelineProject>
                <TimelineItem title={"Starbucks Shift Lead at Target"} date={"Dec 2020 to Sep 2022"}>
                    • Fulfill manager on duty responsibilities<br/>
                    • Certified Starbucks trainer<br/>
                    • Coach, lead, and mentor team members
                </TimelineItem>
                <TimelineProject title={"Undergraduate Applied Research at SCSU"} date={"Fall 2019"}>
                    Part of an agile team that developed a mobile app that allowed users to request lawn and snow
                    services from a local provider (similar to Uber)
                    <br/>Languages/Tools: Flutter, AndroidStudio
                </TimelineProject>
                <TimelineItem title={"Starbucks Barista at Target"} date={"Aug 2018 to Dec 2020"}/>
                <TimelineItem title={"Graduated High School"} date={"Jun 2018"}/>
                <TimelineYear>2018</TimelineYear>
            </Container>
            <Grid container direction="row" justifyContent="space-around" alignItems="stretch"
                  columns={{xs: 1, md: 12}} style={{paddingTop: "1rem"}}>
                <Grid item xs={6}>
                    <div className={"languages elevated"}>
                        <div className={"small-title elevated"}>
                            <Typography variant={"h6"}>
                                <b>Languages</b>
                            </Typography>
                        </div>
                        <Grid container direction="row" justifyContent="space-around" alignItems="center"
                              style={{padding: "1rem"}}>
                            {languages.map((language, index) =>
                                <Grid item key={index}>
                                    <Typography variant={"body1"} style={{width: "11rem"}}>
                                        {"• " + language}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className={"skills elevated"}>
                        <Typography variant={"h6"} className={"small-title elevated"}>
                            <b>Skills/Tools</b>
                        </Typography>
                        <Grid container direction="row" justifyContent="space-around" alignItems="center"
                              style={{padding: "1rem"}}>
                            {skills.map((skill, index) =>
                                <Grid item key={index}>
                                    <Typography variant={"body1"} style={{width: "10rem"}}>
                                        {"• " + skill}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </section>
    )
}