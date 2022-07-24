import React from 'react'
import TimelineItem from "./Timeline Item"
import GitHubIcon from '@mui/icons-material/GitHub';

export default function TimelineProject(props) {
    let title = (props.gitURL === undefined ? "Project: " : "")
    let social = (props.gitURL === undefined ? undefined : <GitHubIcon style={{color: "white", height: "2rem"}} />)
    let url = (props.gitURL === undefined ? undefined : props.gitURL)

    return (
        <TimelineItem title={title + props.title} date={props.date} social={social} url={url}>
            {props.children}
        </TimelineItem>
    )
}