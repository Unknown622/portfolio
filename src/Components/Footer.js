import React, {useEffect, useRef} from 'react'
import "../Style/Footer.css"
import Header from "./Header";
import {Container, Divider, Grid, Stack} from "@mui/material"
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import {saveAs} from "file-saver"
import Resume from '../Resume.pdf'
import ToolTip from "./ToolTip"

const GITHUB_URL = "https://github.com/Unknown622"
const LINKEDIN_URL = "https://www.linkedin.com/in/vincent-zimmer-29776a202/"
const PHONE_NUMBER = "(763) 301-2865"
const EMAIL = "vlz12@yahoo.com"

export default function Footer(props) {
    let scrollRef = useRef()
    const gitHub = <ToolTip title={"GitHub"} link={GITHUB_URL}>
        <div className="footer-icon elevated"><GitHubIcon/></div>
    </ToolTip>
    const linkedIn = <ToolTip title={"LinkedIn"} link={LINKEDIN_URL}>
        <div className="footer-icon elevated"><LinkedInIcon/></div>
    </ToolTip>
    const email = <ToolTip title={"Copy to clipboard"} clipboard={EMAIL}>
        <div className="footer-icon elevated"><EmailRoundedIcon/></div>
    </ToolTip>
    const number = <ToolTip title={"Copy to clipboard"} clipboard={PHONE_NUMBER}>
        <div className="footer-icon elevated"><LocalPhoneRoundedIcon/></div>
    </ToolTip>
    const resume = <ToolTip title={"Download resume"}>
        <div className={"footer-icon elevated"} onClick={() => {saveAs(Resume, "Resume.pdf")}}>
            <DownloadRoundedIcon/>
        </div>
    </ToolTip>

    // Send scroll ref for menubar to parent
    useEffect(() => {
        props.getScroll(scrollRef.current)
    })

    return (
        <div className="footer" ref={scrollRef}>
            <Container maxWidth={"xl"}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="center" style={{padding: "1%"}}
                      columns={{xs: 2, md: 12}}>
                    <Grid item>
                        <Header>Connect</Header>
                    </Grid>
                    <Grid item className="footer-buttons">
                        <Stack spacing={2} direction="row"
                               divider={<Divider orientation="vertical" flexItem style={{backgroundColor: "white"}}/>}>
                            {linkedIn}
                            {gitHub}
                            {email}
                            {number}
                            {resume}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}