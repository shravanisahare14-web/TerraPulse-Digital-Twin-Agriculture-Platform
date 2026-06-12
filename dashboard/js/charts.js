let soilChart;
let tempChart;

const soilHistory = [];
const tempHistory = [];
const labels = [];

function createGradient(ctx, color) {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            260
        );

    gradient.addColorStop(
        0,
        color
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    return gradient;
}

function createCharts() {

    const soilCanvas =
        document
        .getElementById("soilChart");

    const tempCanvas =
        document
        .getElementById("tempChart");

    const soilCtx =
        soilCanvas.getContext("2d");

    const tempCtx =
        tempCanvas.getContext("2d");

    soilChart =
    new Chart(soilCtx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    data: soilHistory,

                    borderColor:
                    "#22c55e",

                    backgroundColor:
                    createGradient(
                        soilCtx,
                        "rgba(34,197,94,.35)"
                    ),

                    fill: true,

                    tension: .45,

                    pointRadius: 0,

                    borderWidth: 3
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }
            },

            scales: {

                x: {

                    ticks: {
                        color: "#94a3b8"
                    },

                    grid: {
                        color:
                        "rgba(255,255,255,.03)"
                    }
                },

                y: {

                    ticks: {
                        color: "#94a3b8"
                    },

                    grid: {
                        color:
                        "rgba(255,255,255,.03)"
                    }
                }
            }
        }
    });

    tempChart =
    new Chart(tempCtx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    data: tempHistory,

                    borderColor:
                    "#38bdf8",

                    backgroundColor:
                    createGradient(
                        tempCtx,
                        "rgba(56,189,248,.35)"
                    ),

                    fill: true,

                    tension: .45,

                    pointRadius: 0,

                    borderWidth: 3
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }
            },

            scales: {

                x: {

                    ticks: {
                        color:"#94a3b8"
                    },

                    grid:{
                        color:
                        "rgba(255,255,255,.03)"
                    }
                },

                y: {

                    ticks:{
                        color:"#94a3b8"
                    },

                    grid:{
                        color:
                        "rgba(255,255,255,.03)"
                    }
                }
            }
        }
    });
}

function updateCharts(data) {

    const now =
        new Date()
        .toLocaleTimeString();

    labels.push(now);

    soilHistory.push(
        data.soil_moisture
    );

    tempHistory.push(
        data.temperature
    );

    if(labels.length > 15){

        labels.shift();

        soilHistory.shift();

        tempHistory.shift();
    }

    soilChart.update();

    tempChart.update();
}