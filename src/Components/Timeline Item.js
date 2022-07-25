import React from 'react'
import {Typography} from "@mui/material"

export default function TimelineItem(props) {
    const title = <Typography variant={"h6"} style={{color: "white"}}>
        <b>{props.title}</b>
    </Typography>

    return (

        <div className={"timeline-item-container"}>
            <div className={"timeline-item"}>
                {props.social === undefined ? title :
                    <a href={props.url === undefined ? "" : props.url} target="_blank" rel="noreferrer"
                       style={{display: "flex", width: "fit-content"}}>
                        <div style={{marginRight: "0.5rem"}}>{props.social}</div>
                        {title}
                    </a>
                }
                <Typography variant={"body1"} style={{color: "white"}}>
                    <b>{props.date}</b>
                </Typography>
                <Typography variant={"body1"} style={{color: "white"}}>
                    {props.children}
                </Typography>
            </div>
            <span className={"timeline-item-connect"}/>
        </div>

    )
}