import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Factory } from "@mui/icons-material";

const pages = {
    "המשימות שלי": "/",
    "החקרים שלי": "/my-researches",
    "פתיחת חקר": "/open-research",
    "פתיחת יישום חקר": "/open-app",
    "רכיב בעייתי": "/bad-product",
};

export function ResponsiveAppBar() {
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
