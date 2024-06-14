import { useCallback, useEffect, useState } from "react";
import { SimpleTable } from "../components/SimpleTable";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";
import { Button, CircularProgress, Typography } from "@mui/material";
import { SelectPeople } from "../components/SelectPeople";

export function OpenApplication() {
    const [rows, setRows] = useState();
    const [choseResearch, setResearch] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            location.href = "/login";
            return;
        }
        const { username } = JSON.parse(userData);
        axios(`${config.url}/application/${username}`)
            .then((resp) => setRows(resp.data))
            .catch(() => toast.error("שגיאה בקבלת הנתונים"));
    }, []);

    return (
        <>
            <Typography variant="h3" sx={{ textAlign: "center", m: 3 }}>
                פתיחת יישום חקר
            </Typography>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 40,
                }}
            >
                {rows ? (
                    rows.length ? (
                        choseResearch ? (
                            <div style={{ width: "40%" }}>
                                <SelectPeople
                                    setSelectedUsers={setSelectedUsers}
                                />
                                <Button
                                    sx={{ m: 4 }}
                                    variant="outlined"
                                    onClick={() => {
                                        localStorage.setItem(
                                            "research",
                                            JSON.stringify({
                                                ...choseResearch,
                                                users: selectedUsers,
                                            })
                                        );
                                        location.href = `/add-tasks/${choseResearch.id}`;
                                    }}
                                >
                                    המשך לחלוקת משימות
                                </Button>
                            </div>
                        ) : (
                            rows.map((r) => (
                                <Button
                                    key={r.research_name}
                                    variant="outlined"
                                    onClick={() => {
                                        setResearch(r);
                                    }}
                                >
                                    {r.research_name}
                                </Button>
                            ))
                        )
                    ) : (
                        <Typography variant="h4">אין חקרים :)</Typography>
                    )
                ) : (
                    <CircularProgress />
                )}
            </div>
        </>
    );
}
