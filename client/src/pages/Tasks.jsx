import {
    Avatar,
    Box,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    CardActions,
    Button,
} from "@mui/material";
import { Biotech } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";

export function Tasks() {
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState({});
    const [currentUser, setCurrentUser] = useState("");
    const [research, setResearch] = useState({});

    useEffect(() => {
        if (!localStorage.getItem("research")) {
            location.href = "/";
        } else {
            setResearch(JSON.parse(localStorage.getItem("research")));
        }
    }, []);

    return (
        <>
            <Box
                sx={{
                    marginTop: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    direction: "rtl",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <Biotech />
                </Avatar>
                <Typography component="h1" variant="h4">
                    הוספת משימות - {research.research_name ?? ""}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", p: 3, gap: 2 }}>
                {(research.users ?? []).map((user) => (
                    <Card sx={{ minWidth: 200 }} key={user.username}>
                        <CardContent>
                            <Typography variant="h6">{`${user.first_name} ${user.last_name}`}</Typography>
                            <Typography color="gray">
                                {user.username}
                            </Typography>
                            <ul>
                                {tasks[user.username]?.map((t) => (
                                    <li style={{ fontFamily: "Heebo" }} key={t}>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardActions>
                            <Button
                                onClick={() => {
                                    setCurrentUser(user.username);
                                    setOpen(true);
                                }}
                            >
                                הוסף משימה
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>הוסף משימה</DialogTitle>
                <DialogContent>
                    <TextField
                        label="משימה חדשה"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>בטל</Button>
                    <Button
                        onClick={() => {
                            setTasks((last) => ({
                                ...last,
                                [currentUser]: [
                                    ...(last[currentUser] ?? []),
                                    newTask,
                                ],
                            }));
                            setOpen(false);
                            setNewTask("");
                        }}
                        color="primary"
                    >
                        הוסף
                    </Button>
                </DialogActions>
            </Dialog>
            <Button
                type="submit"
                variant="contained"
                sx={{ mx: 4 }}
                onClick={() => {
                    axios
                        .post(`${config.url}/tasks`, tasks)
                        .then(async (result) => {
                            toast.info("המשימות נוספו בהצלחה");
                            await new Promise((r) => setTimeout(r, 2000));
                            location.href = "/";
                        })
                        .catch(() => toast.error("שגיאה בהוספת המשימות"));
                }}
            >
                הוסף משימות
            </Button>
        </>
    );
}
