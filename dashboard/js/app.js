createCharts();

const activityFeed = [];

function addActivity(message) {


activityFeed.unshift({

    time: new Date().toLocaleTimeString(),

    message: message
});

// Keep only latest 3

if (activityFeed.length > 3) {

    activityFeed.pop();
}

renderActivity();


}

function renderActivity() {


const container =
    document.getElementById(
        "activityFeed"
    );

container.innerHTML = "";

activityFeed.forEach(item => {

    const div =
        document.createElement(
            "div"
        );

    div.className =
        "activity-item";

    div.innerHTML =

    `
    <strong>${item.time}</strong>
    <span>${item.message}</span>
    `;

    container.appendChild(div);
});


}

async function fetchData() {


try {

    const response =
        await fetch(
            "data/sensor_data.json?nocache=" +
            Date.now()
        );

    const data =
        await response.json();

    // =====================
    // TIMESTAMP
    // =====================

    document.getElementById(
        "timestamp"
    ).innerText =
        data.timestamp;

    // =====================
    // SENSOR VALUES
    // =====================

    document.getElementById(
        "temperature"
    ).innerText =
        data.temperature + " °C";

    document.getElementById(
        "humidity"
    ).innerText =
        data.humidity + " %";

    document.getElementById(
        "soil"
    ).innerText =
        data.soil_moisture + " %";

    document.getElementById(
        "light"
    ).innerText =
        data.light_intensity;

    document.getElementById(
        "water"
    ).innerText =
        data.water_level + " %";

    // =====================
    // KPI
    // =====================

    document.getElementById(
        "cropHealth"
    ).innerText =
        data.crop_health + "%";

    document.getElementById(
        "riskScore"
    ).innerText =
        data.risk_score + "%";

    document.getElementById(
        "waterEfficiency"
    ).innerText =
        data.water_efficiency + "%";

    document.getElementById(
        "pumpStatus"
    ).innerText =
        data.pump_status;

    // Banner status

    const banner =
        document.getElementById(
            "pumpStatusBanner"
        );

    if (banner) {

        banner.innerText =
            data.pump_status;
    }

    // =====================
    // AI RECOMMENDATION
    // =====================

    document.getElementById(
        "recommendation"
    ).innerText =
        data.recommendation;

    // =====================
    // CHARTS
    // =====================

    updateCharts(data);

    // =====================
    // ALERTS
    // =====================

    renderAlerts(data.alerts);

    // =====================
    // DYNAMIC ACTIVITY ENGINE
    // =====================

    const possibleEvents = [

        `Crop Health Recalculated (${data.crop_health}%)`,

        `Soil Moisture Updated (${data.soil_moisture}%)`,

        `Water Reservoir Level (${data.water_level}%)`,

        `Temperature Reading (${data.temperature}°C)`,

        `Humidity Reading (${data.humidity}%)`,

        `Pump Status: ${data.pump_status}`,

        `Water Efficiency Score (${data.water_efficiency}%)`,

        `Risk Score Updated (${data.risk_score}%)`,

        `Digital Twin Synchronized`
    ];

    // Include alerts as events

    data.alerts.forEach(alert => {

        possibleEvents.push(alert);
    });

    const randomEvent =

        possibleEvents[
            Math.floor(
                Math.random() *
                possibleEvents.length
            )
        ];

    addActivity(
        randomEvent
    );

} catch (error) {

    console.error(
        "Error loading data:",
        error
    );
}


}

fetchData();

setInterval(
fetchData,
3000
);
