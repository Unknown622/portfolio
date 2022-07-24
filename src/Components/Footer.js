import React, {useEffect, useRef, useState} from 'react'
import "../Style/Footer.css"
import Header from "./Header";
import {Container, Divider, Grid, Paper, Stack, Tooltip} from "@mui/material"
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'

const GITHUB_URL = "https://github.com/Unknown622"
const LINKEDIN_URL = "https://www.linkedin.com/in/vincent-zimmer-29776a202/"
const PHONE_NUMBER = "(763) 301-2865"
const EMAIL = "vlz12@yahoo.com"

function Contact(props) {
    let [copySuccess, setCopySuccess] = useState(false)

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    return (
        <Tooltip title={copySuccess === true ? "Success" : "Copy to clipboard"} placement="top">
            <Paper elevation={6} className="footer-icon" onClick={() => {
                navigator.clipboard.writeText(props.text).then(async () => {
                    setCopySuccess(true)
                    await timeout(2000)
                    setCopySuccess(false)
                })
            }}>
                {props.children}
            </Paper>
        </Tooltip>
    )
}

export default function Footer(props) {
    const gitHub = <Paper elevation={6} className="footer-icon">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer"><GitHubIcon/></a></Paper>
    const linkedIn = <Paper elevation={6} className="footer-icon">
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><LinkedInIcon/></a></Paper>
    const email = <Contact text={EMAIL}><EmailRoundedIcon/></Contact>
    const number = <Contact text={PHONE_NUMBER}><LocalPhoneRoundedIcon/></Contact>
    let scrollRef = useRef()

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
                               divider={<Divider orientation="vertical" flexItem color="white"/>}>
                            {linkedIn}
                            {gitHub}
                            {email}
                            {number}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}