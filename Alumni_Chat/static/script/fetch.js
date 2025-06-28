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

    loadNotifications()

    setInterval(loadNotifications, 5000)

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            loadNotifications()
        }
    });

})