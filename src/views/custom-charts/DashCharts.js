import React from "react";

export function DashCharts() {
    return (
        <>
            <iframe src="http://127.0.0.1:8050/" title="something" width="400px" height="500" />
            <iframe src="http://127.0.0.1:8050/" title="something" width="100%" height="500" />
            <iframe
                src="http://127.0.0.1:8050/singlle-variate-donut-chart?datasetid=1&tableid=5&attributeid=4&param=A"
                title="something"
                width="100%"
                height="500"
            />
            <iframe
                src="http://127.0.0.1:8050/singlle-variate-col-chart?datasetid=1&tableid=5&attributeid=4&param=A"
                title="something"
                width="100%"
                height="500"
            />
        </>
    );
}

export default DashCharts;
