import React, {useCallback, useLayoutEffect, useRef, useState} from 'react'
import "../Style/ToolTip.css"
import copy from "copy-to-clipboard"

export default function ToolTip(props) {
    const ORIG_TITLE = (props.title === undefined ? "" : props.title) // Keep original tooltip title
    const [title, setTitle] = useState(ORIG_TITLE) // Tooltip text
    const PLACEMENT = (props.placement === undefined ? "top" : props.placement) // Can be top (default), right, bottom, or left
    const CLIPBOARD = (props.clipboard === undefined ? "" : props.clipboard) // This is copied when clicked
    const LINK = (props.link === undefined ? "" : props.link)
    const [className, setClassName] = useState(" hidden") // Classname for tooltip
    const [yCoor, setY] = useState("0") // Y coordinate for tooltip (top in css)
    const [xCoor, setX] = useState("0") // X coordinate for tooltip (left in css)
    const [active, setActive] = useState(false) // Tooltip active
    const [updateNeeded, setUpdateNeeded] = useState(true) // Need to update the position of tooltio
    const containerRef = useRef() // Container ref, used to calc placement
    const tooltipRef = useRef() // Tooltip ref, used to calc placement

    // Updates the placement of the tooltip on the DOM
    // Called when tooltip is active and when an update is needed
    const updatePlacement = useCallback(() => {
        // If refs aren't set
        if (containerRef.current == null || tooltipRef.current == null) {
            // Set to default position (top but not centered)
            setX("0")
            setY("-0.6rem")
            setUpdateNeeded(false) // Placement updated
            return
        } // Otherwise...
        // Place tooltip
        const container = containerRef.current
        const tooltip = tooltipRef.current
        switch (PLACEMENT) {
            case "right":
                setX(container.offsetLeft + container.getBoundingClientRect().width + 12 + "px")
                setY(container.offsetTop + (container.getBoundingClientRect().height / 2) -
                    (tooltip.getBoundingClientRect().height / 2) + "px")
                break
            case "bottom":
                setX(container.offsetLeft + (container.getBoundingClientRect().width / 2) -
                    (tooltip.getBoundingClientRect().width / 2) + "px")
                setY(container.offsetTop + container.getBoundingClientRect().height + 12 + "px")
                break
            case "left":
                setX(container.offsetLeft - tooltip.getBoundingClientRect().width - 12 + "px")
                setY(container.offsetTop + (container.getBoundingClientRect().height / 2) -
                    (tooltip.getBoundingClientRect().height / 2) + "px")
                break
            default: // Top
                setX(container.offsetLeft + (container.getBoundingClientRect().width / 2) -
                    (tooltip.getBoundingClientRect().width / 2) + "px")
                setY(container.offsetTop - (tooltip.getBoundingClientRect().height) - 12 + "px")
                break
        }
        // Override x position
        if (props.overrideX !== undefined) {setX(props.overrideX + "px")}
        // Override y position
        if (props.overrideY !== undefined) {setY(props.overrideY + "px")}
        setUpdateNeeded(false) // Placement updated
    }, [PLACEMENT, props.overrideX, props.overrideY])

    useLayoutEffect(function () {
        // Only update tooltip placement when active and needed (like when text changes)
        if (active && updateNeeded) {
            updatePlacement()
        }
        // Add window resize listener while active
        if (active) {
            // Close tooltip on resize
            window.addEventListener('resize', () => {
                setActive(false)
            })
        }
    }, [active, updateNeeded, updatePlacement])

// Handles click on tooltip container
    function handleClick() {
        if (CLIPBOARD !== "") {
            // Copy to clipboard on click then show copied message
            let error = false
            try {
                copy(CLIPBOARD)
            } // Try copying to clipboard
            catch (e) { // Error
                console.error(e)
                showMessage("Error :(")
                error = true
            }
            // Only show success if no error
            if (!error) {
                showMessage("Copied")
            }
        } else if (LINK !== "") {
            // Redirect to link on click
            window.open(LINK)
        }
    }

// Show a temporary message on the tooltip
    async function showMessage(message) {
        await hideTooltip()
        setTitle(message)
        showTooltip()
        await new Promise(res => setTimeout(res, 2000)) // Wait 2 secs
        await hideTooltip()
        setTitle(ORIG_TITLE)
    }

// Show the tooltip
    function showTooltip() {
        setActive(true) // Add tooltip to DOM but still hidden
        setUpdateNeeded(true) // Need to update placement of tooltip
        // Play animation
        switch (PLACEMENT) {
            case "right":
                setClassName(" slide-in-from-left")
                break
            case "bottom":
                setClassName(" slide-in-from-top")
                break
            case "left":
                setClassName(" slide-in-from-right")
                break
            default: // Top
                setClassName(" slide-in-from-bottom")
                break
        }
    }

// Hide the tooltip
    async function hideTooltip() {
        // Play animation
        switch (PLACEMENT) {
            case "right":
                setClassName(" hidden slide-out-from-right")
                break
            case "bottom":
                setClassName(" hidden slide-out-from-bottom")
                break
            case "left":
                setClassName(" hidden slide-out-from-left")
                break
            default: // Top
                setClassName(" hidden slide-out-from-top")
                break
        }
        await new Promise(res => setTimeout(res, 200)) // Wait for animation to play
        setActive(false) // Remove tooltip from DOM
    }

    return (
        <div ref={containerRef} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onClick={handleClick}
             className={(props.containerClass === undefined ? "" : props.containerClass)
                 + (CLIPBOARD !== "" || LINK !== "" ? " tooltip-button" : "")}>
            {props.children}
            {active &&
                <div style={{left: xCoor, top: yCoor}} className={"tooltip" + className} ref={tooltipRef}>{title}</div>
            }
        </div>
    )
}