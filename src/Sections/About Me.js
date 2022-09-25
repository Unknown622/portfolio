import React from 'react'
import {Grid, Typography} from "@mui/material"
import Header from "../Components/Header"

export default function AboutMe(props) {
    return (
        <section>
            <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch"
                  columns={{xs: 2, md: 12}}>
                <Grid item xs={3} style={{paddingBottom: "2rem"}}>
                    <Header>About Me</Header>
                </Grid>
                <Grid item xs={9}>
                    <div className={"about-text elevated"}>
                        <Typography paragraph variant={"body1"} style={{color: "white", margin: "0"}}>
                            {props.children}
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </section>
    )
}