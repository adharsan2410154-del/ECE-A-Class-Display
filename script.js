/* =========================================
   ECE-A CLASS DISPLAY
   FIREBASE LIVE DATABASE
========================================= */


/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

    apiKey: "AIzaSyB9yO0eYwJm-lwFC5-TzFxqYtSdIxshpQ6-c",

    authDomain: "ece-a-class-display.firebaseapp.com",

    projectId: "ece-a-class-display",

    storageBucket: "ece-a-class-display.firebasestorage.app",

    messagingSenderId: "602913171442",

    appId: "1:602913171442:web:740f9ecd4bf298e866ad6b"

};


/* =========================================
   INITIALIZE FIREBASE
========================================= */

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


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
   CONVERT TIME
========================================= */

function timeToMinutes(timeString) {

    let text = timeString
        .toUpperCase()
        .trim();


    let match = text.match(
        /(\d{1,2}):(\d{2})\s*(AM|PM)?/
    );


    if (!match) {

        return 0;

    }


    let hours = Number(match[1]);

    let minutes = Number(match[2]);

    let period = match[3];


    if (period === "PM" && hours !== 12) {

        hours += 12;

    }


    if (period === "AM" && hours === 12) {

        hours = 0;

    }


    return hours * 60 + minutes;

}


/* =========================================
   GET START / END TIME
========================================= */

function getTimeParts(timeText) {

    const parts =
        timeText.split("-");


    if (parts.length < 2) {

        return {
            start: 0,
            end: 0
        };

    }


    return {

        start: timeToMinutes(parts[0]),

        end: timeToMinutes(parts[1])

    };

}


/* =========================================
   STATUS
========================================= */

function calculateStatus(timeText) {

    const now = new Date();


    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();


    const times =
        getTimeParts(timeText);


    if (currentMinutes < times.start) {

        return "UPCOMING";

    }


    if (
        currentMinutes >= times.start &&
        currentMinutes < times.end
    ) {

        return "ONGOING";

    }


    return "COMPLETED";

}


/* =========================================
   STATUS CSS CLASS
========================================= */

function getStatusClass(status) {

    switch (status) {

        case "ONGOING":

            return "status-ongoing";


        case "COMPLETED":

            return "status-completed";


        case "CANCELLED":

            return "status-cancelled";


        default:

            return "status-upcoming";

    }

}


/* =========================================
   DISPLAY PERIODS
========================================= */

function displayPeriods(periods) {

    const list =
        document.getElementById("period-list");


    list.innerHTML = "";


    periods.forEach(function(period) {

        let status;


        /*
         * If Firebase says CANCELLED,
         * keep it cancelled.
         *
         * Otherwise calculate automatically.
         */

        if (
            String(period.status || "")
                .toUpperCase() === "CANCELLED"
        ) {

            status = "CANCELLED";

        }

        else {

            status =
                calculateStatus(
                    period.time
                );

        }


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


        const statusClass =
            getStatusClass(status);


        row.innerHTML = `

            <div class="period-number">

                ${period.periodNo ?? ""}

            </div>


            <div class="period-time">

                ${period.time ?? ""}

            </div>


            <div class="period-subject">

                ${period.subject ?? ""}

            </div>


            <div class="period-status ${statusClass}">

                ${status}

            </div>

        `;


        list.appendChild(row);

    });

}


/* =========================================
   FIREBASE REAL-TIME LISTENER
========================================= */

db.collection("periods")

    .orderBy("periodNo")

    .onSnapshot(

        function(snapshot) {

            const periods = [];


            snapshot.forEach(function(doc) {

                periods.push({

                    id: doc.id,

                    ...doc.data()

                });

            });


            displayPeriods(periods);

        },


        function(error) {

            console.error(
                "Firebase error:",
                error
            );


            document.getElementById(
                "period-list"
            ).innerHTML = `

                <div style="
                    text-align:center;
                    padding:40px;
                    color:#ff5555;
                    font-size:22px;
                ">

                    DATABASE CONNECTION ERROR

                </div>

            `;

        }

    );


/* =========================================
   REFRESH STATUS EVERY 30 SECONDS
========================================= */

setInterval(function() {

    db.collection("periods")
        .orderBy("periodNo")
        .get()
        .then(function(snapshot) {

            const periods = [];


            snapshot.forEach(function(doc) {

                periods.push({

                    id: doc.id,

                    ...doc.data()

                });

            });


            displayPeriods(periods);

        });

}, 30000);
