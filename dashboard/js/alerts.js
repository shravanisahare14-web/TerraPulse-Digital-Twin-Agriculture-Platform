function renderAlerts(alerts){

    const container =
        document.getElementById(
            "alertsContainer"
        );

    container.innerHTML = "";

    if(alerts.length === 0){

        container.innerHTML =
        `
        <div class="alert-item">
            ✅ System Healthy
        </div>
        `;

        return;
    }

    alerts.forEach(alert => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "alert-item";

        div.innerText =
            "⚠ " + alert;

        container.appendChild(div);
    });
}