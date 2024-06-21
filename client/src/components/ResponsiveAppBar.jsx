import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Factory } from "@mui/icons-material";
import axios from "axios";
import { config } from "../config";
import { Divider } from "@mui/material";

export function ResponsiveAppBar() {
    const [pages, setPages] = React.useState({
        "המשימות שלי": "/",
        "רכיב בעייתי": "/bad-product",
        "פתיחת חקר": "/open-research",
        "החקרים שלי": "/my-researches",
        "יישומי חקר": "applications",
        "כניסה לייצור רציף": "/start-production",
        סטטיסטיקות: "/statistics",
    });

    React.useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            return;
        }
        const { username } = JSON.parse(userData);
        // check if the user is manager - send its username and get the relevant
        // researches of its line and add it to the app bar
        axios.get(`${config.url}/line-researches/${username}`).then((resp) => {
            if (resp.data.length) {
                setPages((last) => ({
                    ...last,
                    "פתיחת יישום חקר": "/open-app",
                }));
            }
        });
    }, []);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <a href="/">
                        <img
                            src="Elbit_Systems.png"
                            style={{ width: 170, marginLeft: 10 }}
                        />
                    </a>
                    {localStorage.getItem("userData") ? (
                        <>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                }}
                            >
                                {Object.keys(pages).map((page) => (
                                    <div
                                        style={{
                                            backgroundColor: "#5777FF",
                                            borderRadius: 13,
                                            margin: 6,
                                        }}
                                        key={page}
                                    >
                                        <Button
                                            href={`${pages[page]}`}
                                            sx={{
                                                color: "white",
                                                display: "block",
                                            }}
                                        >
                                            {page}
                                        </Button>
                                    </div>
                                ))}
                            </Box>

                            <div
                                style={{
                                    backgroundColor: "#5777FF",
                                    borderRadius: 13,
                                    margin: 6,
                                    padding: 10,
                                }}
                            >
                                <Typography
                                    sx={{ ":hover": { cursor: "pointer" } }}
                                    onClick={() => {
                                        localStorage.removeItem("userData");
                                        location.href = "/login";
                                    }}
                                >
                                    התנתק
                                </Typography>
                            </div>
                        </>
                    ) : null}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
