import { Box, CircularProgress, Tab, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";
import { StatisticsComponent } from "../components/StatisticsComponent";
import axios from "axios";
import { config } from "../config";

export function Statistics() {
    const [value, setValue] = useState("1");
    const [data, setData] = useState();

    useEffect(() => {
        async function my() {
            const reAg = await axios(`${config.url}/researches-agg`);
            console.log(reAg.data);
            const apAg = await axios(`${config.url}/applications-agg`);
            console.log(apAg.data);

            setData([reAg.data, apAg.data]);
        }
        my();
    }, []);

    return (
        <>
            <Typography
                component="h1"
                variant="h4"
                sx={{ m: 3, textAlign: "center" }}
            >
                סטטיסטיקות
            </Typography>

            <TabContext value={value}>
                <TabList onChange={(event, newValue) => setValue(newValue)}>
                    <Tab label="כמות החקרים" value="1" />
                    <Tab label="חקרים שנסגרו" value="2" />
                    <Tab label="כמות יישומי החקר" value="3" />
                    <Tab label="יישומי חקר שנסגרו" value="4" />
                    <Tab label="יישומי החקר שהצליחו" value="5" />
                    <Tab label="סכום העלויות של יישומי החקר" value="6" />
                    <Tab label="ממוצע העלות של יישומי החקר" value="7" />
                </TabList>
                {data ? (
                    <>
                        <TabPanel value="1">
                            <StatisticsComponent
                                title="r_count"
                                data={data[0]}
                            />
                        </TabPanel>
                        <TabPanel value="2">
                            <StatisticsComponent
                                title="closed_r_count"
                                data={data[1]}
                            />
                        </TabPanel>
                        <TabPanel value="3">
                            <StatisticsComponent
                                title="a_count"
                                data={data[1]}
                            />
                        </TabPanel>
                        <TabPanel value="4">
                            <StatisticsComponent
                                title="closed_a_count"
                                data={data[1]}
                            />
                        </TabPanel>
                        <TabPanel value="5">
                            <StatisticsComponent
                                title="success_count"
                                data={data[1]}
                            />
                        </TabPanel>
                        <TabPanel value="6">
                            <StatisticsComponent
                                title="price_sum"
                                data={data[1]}
                            />
                        </TabPanel>
                        <TabPanel value="7">
                            <StatisticsComponent
                                title="avg_price"
                                data={data[1]}
                            />
                        </TabPanel>
                    </>
                ) : (
                    <CircularProgress />
                )}
            </TabContext>
        </>
    );
}
