document.addEventListener('DOMContentLoaded', () => {
    function loadNotifications() {
        fetch("notifications/")
            .then(response => response.json())
            .then(data => {
                const notificatioPannel = document.querySelector('#notification-list');
                let notifCount = document.querySelector('#notifCount');
                notificatioPannel.innerHTML = "";
                notifCount.innerHTML = "0"
                if (data.notifications.length === 0) {
                    notificatioPannel.innerHTML = `<div class="text-muted">No new notifications..</div>`
                    return;
                }
                data.notifications.forEach((notif) => {
                    notificatioPannel.innerHTML += `<a href="${notif.url}" class="list-group-item list-group-item-action">
                     ${notif.message}
                     <small class="d-block text-muted">${notif.timestamp}</small>
                     </a>`;
                    notifCount.innerHTML = `${data.notifications.length}`
                })
            })
            .catch(error => console.error("Error:", error));

    }




    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            loadNotifications()
        }
    });

    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(function (permission) {

        });
    }

    const notifSocketUrl = protocol + host + "/ws/notifications" + "/";
    const notificationSocket = new WebSocket(notifSocketUrl);

    notificationSocket.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.type === "new_notification" && data.payload?.current_notification) {
            if (Notification.permission === "granted") {
                new Notification("🔔 New Notification", {
                    body: data.payload.current_notification,
                });
                console.log(Notification);

            } else {
                alert("🔔 " + data.payload.current_notification);
            }

        }

    };


})



