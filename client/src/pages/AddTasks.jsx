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
import { useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const defaultNewTask = {
    dest_date: new Date(),
    task_name: "",
};

export function AddTasks() {
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState(defaultNewTask);
    const [tasks, setTasks] = useState({});
    const [currentUser, setCurrentUser] = useState("");
    const [research, setResearch] = useState({});

    const { researchId } = useParams();

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
                                    <li
                                        style={{
                                            fontFamily: "Heebo",
                                            margin: "10px",
                                        }}
                                        key={t.task_name}
                                    >
                                        - {t.task_name} (עד{" "}
                                        {t.dest_date.toLocaleDateString()})
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
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        fontFamily: "Heebo",
                    }}
                >
                    <TextField
                        label="משימה חדשה"
                        value={newTask.task_name}
                        onChange={(e) =>
                            setNewTask((last) => ({
                                ...last,
                                task_name: e.target.value,
                            }))
                        }
                        sx={{ mt: 2 }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <label
                            style={{
                                textAlign: "right",
                                direction: "rtl",
                                marginTop: 10,
                                marginRight: 2,
                                marginBottom: 2,
                            }}
                        >
                            תאריך יעד:
                        </label>
                        <DatePicker
                            format="d/M/y"
                            value={newTask.dest_date}
                            onChange={(e) =>
                                setNewTask((last) => ({
                                    ...last,
                                    dest_date: e,
                                }))
                            }
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>בטל</Button>
                    <Button
                        onClick={() => {
                            setTasks((last) => ({
                                ...last,
                                [currentUser]: [
                                    ...(last[currentUser] ?? []),
                                    {
                                        ...newTask,
                                        research_name: research.research_name,
                                        dest_date: newTask.dest_date,
                                    },
                                ],
                            }));
                            setOpen(false);
                            setNewTask(defaultNewTask);
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
