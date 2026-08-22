/* =========================================
   ECE-A CLASS TIMETABLE
========================================= */

const periods = [

    {
        number: 1,
        start: "09:00",
        end: "10:00",
        subject: "DIGITAL SIGNAL PROCESSING"
    },

    {
        number: 2,
        start: "10:00",
        end: "11:00",
        subject: "DIGITAL SYSTEM DESIGN"
    },

    {
        number: 3,
        start: "11:15",
        end: "12:15",
        subject: "MICROPROCESSOR"
    },

    {
        number: 4,
        start: "12:15",
        end: "13:15",
        subject: "ANALOG COMMUNICATION"
    },

    {
        number: 5,
        start: "14:00",
        end: "15:00",
        subject: "LINEAR INTEGRATED CIRCUITS"
    },

    {
        number: 6,
        start: "15:00",
        end: "16:00",
        subject: "DATA STRUCTURES"
    },

    {
        number: 7,
        start: "16:00",
        end: "17:00",
        subject: "MICROCONTROLLER"
    },

    {
        number: 8,
        start: "17:00",
        end: "18:00",
        subject: "LAB / TUTORIAL"
    }

];


/* =========================================
   LIVE CLOCK
========================================= */

function updateClock() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("en-IN", {
            hour12: false
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

}


updateClock();

setInterval(updateClock, 1000);


/* =========================================
   CONVERT HH:MM TO MINUTES
========================================= */

function timeToMinutes(time) {

    const parts = time.split(":");

    return (
        Number(parts[0]) * 60 +
        Number(parts[1])
    );

}


/* =========================================
   GET CURRENT STATUS
========================================= */

function getStatus(period) {

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();


    const start =
        timeToMinutes(period.start);

    const end =
        timeToMinutes(period.end);


    if (currentMinutes < start) {

        return "UPCOMING";

    }


    if (
        currentMinutes >= start &&
        currentMinutes < end
    ) {

        return "ONGOING";

    }


    return "COMPLETED";

}


/* =========================================
   DISPLAY PERIODS
========================================= */

function displayPeriods() {

    const list =
        document.getElementById("period-list");

    list.innerHTML = "";


    periods.forEach(function(period) {

        const status =
            getStatus(period);


        const row =
            document.createElement("div");

        row.className =
            "period-row";


        /* Highlight current period */

        if (status === "ONGOING") {

            row.classList.add(
                "current-period"
            );

        }


        let statusClass = "";


        if (status === "ONGOING") {

            statusClass =
                "status-ongoing";

        }

        else if (status === "UPCOMING") {

            statusClass =
                "status-upcoming";

        }

        else if (status === "COMPLETED") {

            statusClass =
                "status-completed";

        }


        row.innerHTML = `

            <div class="period-number">
                ${period.number}
            </div>

            <div class="period-time">
                ${period.start} – ${period.end}
            </div>

            <div class="period-subject">
                ${period.subject}
            </div>

            <div class="period-status ${statusClass}">
                ${status}
            </div>

        `;


        list.appendChild(row);

    });

}


/* =========================================
   INITIAL DISPLAY
========================================= */

displayPeriods();


/* =========================================
   UPDATE STATUS EVERY MINUTE
========================================= */

setInterval(

    displayPeriods,

    30000

);
