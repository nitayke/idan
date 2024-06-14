import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export function MyDatePicker({ date, setDate }) {
    return (
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
            <DatePicker format="d/M/y" value={date} onChange={setDate} />
        </LocalizationProvider>
    );
}
