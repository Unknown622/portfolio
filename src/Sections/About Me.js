import React from 'react'
import {Grid, Paper, Typography} from "@mui/material"
import Header from "../Components/Header"

export default function AboutMe(props) {
    return (
        <div className={"section"}>
            <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch"
                  columns={{xs: 2, md: 12}}>
                <Grid item xs={4} style={{paddingBottom: "2rem"}}>
                    <Header>About Me</Header>
                </Grid>
                <Grid item xs={8}>
                    <Paper elevation={6} className={"about-text"}>
                        <Typography paragraph variant={"body1"} style={{color: "white"}}>
                            {props.children}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}