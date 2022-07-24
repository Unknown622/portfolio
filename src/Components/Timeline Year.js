import React from 'react'
import {Typography} from "@mui/material";

export default function TimelineYear(props) {
    return(
        <div className={"timeline-item-year"}>
            <Typography variant={"h6"} style={{color: "white", padding: "0px"}}>
                <b>{props.children}</b>
            </Typography>
        </div>
    )
}