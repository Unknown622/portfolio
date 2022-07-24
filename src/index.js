import React from 'react'
import ReactDOM from 'react-dom/client'
// import reportWebVitals from './reportWebVitals'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "./Pages/Home"
import {createTheme, ThemeProvider} from "@mui/material"
import 'animate.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
// Theme from: https://www.color-hex.com/color-palette/1294
const theme = createTheme({
    palette: {
        primary: {
            main: "#005b96",
        },
        secondary: {
            main: "#03396c",
        },
    },
})

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
)

// reportWebVitals(console.log)
