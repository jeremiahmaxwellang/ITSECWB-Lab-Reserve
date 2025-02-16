document.addEventListener('DOMContentLoaded', function () {
    const currentTableBody = document.querySelector('#currentReservationsTable tbody');
    const recentTableBody = document.querySelector('#recentReservationsTable tbody');

    if (!currentTableBody || !recentTableBody) {
        console.error("Table body elements not found in DOM.");
        return;
    }

    const currentReservations = [
        { roomNumber: 'GK01', seatNumber: 'Seat #01', dateTime: 'August 5, 2025 - 01:01:01 PM' },
        { roomNumber: 'GK02', seatNumber: 'Seat #02', dateTime: 'August 6, 2025 - 02:30:00 PM' },
        { roomNumber: 'GK03', seatNumber: 'Seat #03', dateTime: 'August 7, 2025 - 10:15:00 AM' },
        { roomNumber: 'GK04', seatNumber: 'Seat #04', dateTime: 'August 8, 2025 - 04:45:00 PM' },
    ];

    const recentReservations = [
        { roomNumber: 'GK01', seatNumber: 'Seat #01', dateTime: 'August 1, 2025 - 12:00:00 PM', reservedBy: 'John Reservation' },
        { roomNumber: 'GK02', seatNumber: 'Seat #02', dateTime: 'August 2, 2025 - 03:15:00 PM', reservedBy: 'Jane Doe' },
        { roomNumber: 'GK03', seatNumber: 'Seat #03', dateTime: 'August 3, 2025 - 11:45:00 AM', reservedBy: 'Alice Smith' },
        { roomNumber: 'GK04', seatNumber: 'Seat #04', dateTime: 'August 4, 2025 - 09:30:00 AM', reservedBy: 'Bob Johnson' },
    ];

    function populateTable(data, tableBody, isCurrent) {
        tableBody.innerHTML = ''; // Clear previous data

        data.forEach(reservation => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = reservation.roomNumber;
            row.insertCell(1).innerText = reservation.seatNumber;
            row.insertCell(2).innerText = reservation.dateTime;

            if (isCurrent) {
                const editCell = row.insertCell(3);
                const editButton = document.createElement('button');
                editButton.className = 'edit-button';
                editButton.innerText = 'Edit';
                editButton.onclick = function () {
                    window.location.href = 'Reservation.html';
                };
                editCell.appendChild(editButton);
            } else {
                row.insertCell(3).innerText = reservation.reservedBy;
            }
        });
    }

    // Populate tables
    populateTable(currentReservations, currentTableBody, true);
    populateTable(recentReservations, recentTableBody, false);
});
