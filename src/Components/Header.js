import React from "react"
import {Typography} from "@mui/material"

export default function Header(props) {
    return (
        <Typography variant={"h4"}>
            <b className={"section-header"}>{props.children}</b>
        </Typography>
    )
}