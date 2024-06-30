import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { CircularProgress } from "@mui/material";

const months = [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר",
];

export function StatisticsComponent({ data, title }) {
    return data ? (
        data[0][title] ? (
            <LineChart
                width={500}
                height={300}
                data={data.map((d) => ({
                    name: months[d["month(open_date)"] - 1],
                    [title]: d[title],
                }))}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={title} stroke="#82ca9d" />
            </LineChart>
        ) : (
            "אין נתונים :)"
        )
    ) : (
        <CircularProgress />
    );
}
