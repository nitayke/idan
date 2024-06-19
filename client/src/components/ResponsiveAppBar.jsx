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

export function ResponsiveAppBar() {
    const [pages, setPages] = React.useState({
        "המשימות שלי": "/",
        "החקרים שלי": "/my-researches",
        "פתיחת חקר": "/open-research",
        "רכיב בעייתי": "/bad-product",
        "כניסה לייצור רציף": "/start-production",
        "יישומי חקר": "applications",
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
                    <Factory sx={{ display: "flex", mr: 1 }} href="/" />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: "flex",
                            fontWeight: 700,
                            letterSpacing: ".2rem",
                            color: "inherit",
                            fontSize: 30,
                            textDecoration: "none",
                        }}
                    >
                        אלביט
                    </Typography>
                    {localStorage.getItem("userData") ? (
                        <>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                }}
                            >
                                {Object.keys(pages).map((page) => (
                                    <Button
                                        key={page}
                                        href={`${pages[page]}`}
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </Box>
                            <Typography
                                sx={{ ":hover": { cursor: "pointer" } }}
                                onClick={() => {
                                    localStorage.removeItem("userData");
                                    location.href = "/login";
                                }}
                            >
                                התנתק
                            </Typography>
                        </>
                    ) : null}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
