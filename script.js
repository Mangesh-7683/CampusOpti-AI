
// ======================================================
// CAMPUSOPTI AI
// Complete Frontend JavaScript
// ======================================================

// Same-origin connection.
// Dashboard is served by FastAPI at http://127.0.0.1:8000/app/
const API = "";

let allTimetable = [];


// ======================================================
// 1. HELPER FUNCTIONS
// ======================================================

async function fetchAPI(endpoint) {

    const response = await fetch(`${API}${endpoint}`);

    if (!response.ok) {
        throw new Error(
            `API Error ${response.status}: ${endpoint}`
        );
    }

    return await response.json();
}


function escapeHTML(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]
    );
}


function showError(message) {

    console.error("CampusOpti AI Error:", message);

}


// ======================================================
// 2. DASHBOARD STATISTICS
// ======================================================

async function loadDashboard() {

    try {

        const data = await fetchAPI("/api/dashboard");

        const fields = {

            totalLectures: data.total_lectures,

            scheduledLectures: data.scheduled_lectures,

            unscheduledLectures: data.unscheduled_lectures,

            schedulingPercentage:
                data.scheduling_percentage + "%",

            roomUtilisation:
                data.room_utilisation + "%",

            totalFaculty: data.total_faculty,

            totalClassrooms: data.total_classrooms,

            totalBatches: data.total_batches

        };


        Object.entries(fields).forEach(([id, value]) => {

            const element = document.getElementById(id);

            if (element) {
                element.textContent = value;
            }

        });


        createSchedulingChart(data);

        console.log("Dashboard statistics loaded successfully.");

    }

    catch (error) {

        showError(error.message);

    }

}


// ======================================================
// 3. SCHEDULING PERFORMANCE PIE CHART
// ======================================================

function createSchedulingChart(data) {

    if (!window.Plotly) {

        console.error("Plotly library not loaded.");

        return;

    }


    Plotly.newPlot(

        "schedulingChart",

        [

            {

                values: [

                    data.scheduled_lectures,

                    data.unscheduled_lectures

                ],

                labels: [

                    "Scheduled",

                    "Unscheduled"

                ],

                type: "pie",

                hole: 0.55,

                textinfo: "label+percent",

                marker: {

                    colors: [

                        "#2563eb",

                        "#f59e0b"

                    ]

                }

            }

        ],

        {

            margin: {

                t: 10,

                b: 10,

                l: 10,

                r: 10

            },

            showlegend: true,

            legend: {

                orientation: "h",

                y: -0.1

            },

            paper_bgcolor: "white",

            font: {

                family: "Inter, sans-serif"

            }

        },

        {

            responsive: true,

            displayModeBar: false

        }

    );

}


// ======================================================
// 4. LOAD ALGORITHM COMPARISON
// ======================================================

async function loadAlgorithms() {

    try {

        const data = await fetchAPI("/api/algorithms");


        if (!Array.isArray(data) || data.length === 0) {

            throw new Error("No algorithm comparison data found.");

        }


        const columns = Object.keys(data[0]);


        // ----------------------------------------------
        // FORMAT 1:
        // Metrics are rows and algorithms are columns.
        //
        // Metric | Greedy | Genetic | OR-Tools CP-SAT
        // ----------------------------------------------

        const metricColumn = columns.find(

            key => key.toLowerCase().includes("metric")

        );


        if (metricColumn) {

            const algorithmNames = columns.filter(

                key => key !== metricColumn

            );


            // Find the execution-time row.

            const executionRow = data.find(item => {

                const metricName = String(
                    item[metricColumn] ?? ""
                ).toLowerCase();

                return (

                    metricName.includes("execution") ||

                    metricName.includes("time")

                );

            });


            if (!executionRow) {

                throw new Error(
                    "Execution time row not found in algorithm CSV."
                );

            }


            const executionTimes = algorithmNames.map(name => {

                return Number(executionRow[name]);

            });


            if (
                executionTimes.some(
                    value => !Number.isFinite(value)
                )
            ) {

                throw new Error(
                    "Invalid execution time values in CSV."
                );

            }


            // Create chart using actual CSV values.

            createExecutionChart(

                algorithmNames,

                executionTimes

            );


            // Display complete comparison table.

            displayAlgorithmTable(data, columns);


            console.log(
                "Algorithm chart loaded using metric-row format."
            );

        }


        // ----------------------------------------------
        // FORMAT 2:
        // Each algorithm is a separate row.
        // ----------------------------------------------

        else {

            const algorithmColumn = columns.find(

                key => key.toLowerCase().includes("algorithm")

            );


            const timeColumn = columns.find(

                key => key.toLowerCase().includes("execution")

            );


            if (!algorithmColumn || !timeColumn) {

                throw new Error(
                    "Could not identify algorithm comparison columns."
                );

            }


            const names = data.map(

                item => item[algorithmColumn]

            );


            const times = data.map(

                item => Number(item[timeColumn])

            );


            if (
                times.some(value => !Number.isFinite(value))
            ) {

                throw new Error(
                    "Invalid execution time values."
                );

            }


            createExecutionChart(names, times);

            displayAlgorithmTable(data, columns);


            console.log(
                "Algorithm chart loaded using algorithm-row format."
            );

        }

    }

    catch (error) {

        console.error("Algorithm Error:", error);


        const chart = document.getElementById("executionChart");

        const body = document.getElementById("algorithmBody");


        if (chart) {

            chart.innerHTML = `
                <p style="color:#dc2626;padding:20px">
                    ${escapeHTML(error.message)}
                </p>
            `;

        }


        if (body) {

            body.innerHTML = `
                <tr>
                    <td colspan="10">
                        ${escapeHTML(error.message)}
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================================
// 5. ALGORITHM EXECUTION TIME BAR CHART
// ======================================================

function createExecutionChart(names, times) {

    if (!window.Plotly) {

        console.error("Plotly is unavailable.");

        return;

    }


    Plotly.newPlot(

        "executionChart",

        [

            {

                x: names,

                y: times,

                type: "bar",

                text: times.map(

                    value => value.toFixed(4) + " sec"

                ),

                textposition: "outside",

                marker: {

                    color: [

                        "#2563eb",

                        "#f59e0b",

                        "#16a34a"

                    ]

                }

            }

        ],

        {

            margin: {

                t: 30,

                b: 75,

                l: 60,

                r: 20

            },

            yaxis: {

                title: "Execution Time (seconds)",

                rangemode: "tozero"

            },

            xaxis: {

                title: "Optimisation Algorithms",

                tickangle: -15

            },

            paper_bgcolor: "white",

            plot_bgcolor: "white",

            font: {

                family: "Inter, sans-serif"

            }

        },

        {

            responsive: true,

            displayModeBar: false

        }

    );

}


// ======================================================
// 6. ALGORITHM COMPARISON TABLE
// ======================================================

function displayAlgorithmTable(data, columns) {

    const head = document.getElementById("algorithmHead");

    const body = document.getElementById("algorithmBody");


    head.innerHTML = `

        <tr>

            ${columns.map(column => `

                <th>${escapeHTML(column)}</th>

            `).join("")}

        </tr>

    `;


    body.innerHTML = data.map(item => `

        <tr>

            ${columns.map(column => `

                <td>${escapeHTML(item[column])}</td>

            `).join("")}

        </tr>

    `).join("");

}


// ======================================================
// 7. LOAD OPTIMISED TIMETABLE
// ======================================================

async function loadTimetable() {

    try {

        allTimetable = await fetchAPI("/api/timetable");


        if (!Array.isArray(allTimetable)) {

            throw new Error("Invalid timetable data.");

        }


        populateBatchFilter();


        displayTimetable(allTimetable);


        document.getElementById(
            "timetableCount"
        ).textContent =

            `${allTimetable.length} Scheduled Lectures`;


        console.log(

            "Timetable loaded:",

            allTimetable.length

        );

    }

    catch (error) {

        console.error("Timetable Error:", error);


        document.getElementById(
            "timetableBody"
        ).innerHTML = `

            <tr>

                <td colspan="7">

                    ${escapeHTML(error.message)}

                </td>

            </tr>

        `;

    }

}


// ======================================================
// 8. POPULATE BATCH FILTER
// ======================================================

function populateBatchFilter() {

    const filter = document.getElementById("batchFilter");


    const batches = [

        ...new Set(

            allTimetable.map(item => item.batch_id)

        )

    ].sort();


    filter.innerHTML = `

        <option value="all">All Batches</option>

    `;


    batches.forEach(batch => {

        const option = document.createElement("option");

        option.value = batch;

        option.textContent = batch;

        filter.appendChild(option);

    });

}


// ======================================================
// 9. DISPLAY TIMETABLE
// ======================================================

function displayTimetable(data) {

    const body = document.getElementById("timetableBody");


    if (!data.length) {

        body.innerHTML = `

            <tr>

                <td colspan="7">

                    No timetable records found.

                </td>

            </tr>

        `;

        return;

    }


    body.innerHTML = data.map(item => `

        <tr>

            <td>${escapeHTML(item.batch_id)}</td>

            <td>${escapeHTML(item.subject_name)}</td>

            <td>${escapeHTML(item.faculty_id)}</td>

            <td>${escapeHTML(item.room_id)}</td>

            <td>${escapeHTML(item.day)}</td>

            <td>${escapeHTML(item.time)}</td>

            <td>${escapeHTML(item.slot_id)}</td>

        </tr>

    `).join("");

}


// ======================================================
// 10. FILTER TIMETABLE
// ======================================================

function filterTimetable() {

    const selectedBatch =

        document.getElementById("batchFilter").value;


    const selectedDay =

        document.getElementById("dayFilter").value;


    let filtered = allTimetable;


    if (selectedBatch !== "all") {

        filtered = filtered.filter(

            item => item.batch_id === selectedBatch

        );

    }


    if (selectedDay !== "all") {

        filtered = filtered.filter(

            item => item.day === selectedDay

        );

    }


    displayTimetable(filtered);


    document.getElementById(
        "timetableCount"
    ).textContent =

        `${filtered.length} Matching Lectures`;

}


// ======================================================
// 11. DOWNLOAD TIMETABLE AS CSV
// ======================================================

function downloadTimetable() {

    if (!allTimetable.length) {

        alert("No timetable data available.");

        return;

    }


    const headers = [

        "Batch",

        "Subject",

        "Faculty",

        "Room",

        "Day",

        "Time",

        "Slot ID"

    ];


    const rows = allTimetable.map(item => [

        item.batch_id,

        item.subject_name,

        item.faculty_id,

        item.room_id,

        item.day,

        item.time,

        item.slot_id

    ]);


    const csv = [headers, ...rows]

        .map(row =>

            row.map(value =>

                `"${String(value ?? "").replace(/"/g, '""')}"`

            ).join(",")

        )

        .join("\n");


    const blob = new Blob(

        ["\uFEFF" + csv],

        {

            type: "text/csv;charset=utf-8;"

        }

    );


    const url = URL.createObjectURL(blob);


    const link = document.createElement("a");


    link.href = url;

    link.download = "CampusOpti_AI_Timetable.csv";


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);

}


// ======================================================
// 12. UNSCHEDULED LECTURE ANALYSIS
// ======================================================

async function loadUnscheduled() {

    try {

        const data = await fetchAPI("/api/unscheduled");


        document.getElementById(

            "unscheduledAnalysisCount"

        ).textContent = data.total_unscheduled;


        const body = document.getElementById(
            "unscheduledBody"
        );


        if (!data.records || data.records.length === 0) {

            body.innerHTML = `

                <tr>

                    <td colspan="5">

                        All lectures have been scheduled.

                    </td>

                </tr>

            `;

            return;

        }


        body.innerHTML = data.records.map(item => `

            <tr>

                <td>${escapeHTML(item.batch_id)}</td>

                <td>${escapeHTML(item.subject_name)}</td>

                <td>${escapeHTML(item.faculty_id)}</td>

                <td>${escapeHTML(item.unscheduled_count)}</td>

                <td>${escapeHTML(item.reason)}</td>

            </tr>

        `).join("");


        console.log("Unscheduled analysis loaded.");

    }

    catch (error) {

        console.error("Unscheduled Analysis Error:", error);


        document.getElementById(
            "unscheduledBody"
        ).innerHTML = `

            <tr>

                <td colspan="5">

                    ${escapeHTML(error.message)}

                </td>

            </tr>

        `;

    }

}


// ======================================================
// 13. LOAD FACULTY INFORMATION
// ======================================================

async function loadFaculty() {

    try {

        const data = await fetchAPI("/api/faculty");


        const list = document.getElementById("facultyList");


        document.getElementById(
            "facultyCount"
        ).textContent = `${data.length} Members`;


        list.innerHTML = data.map(item => `

            <li>

                <span>

                    ${escapeHTML(item.faculty_name)}

                </span>

                <strong>

                    ${escapeHTML(item.faculty_id)}

                </strong>

            </li>

        `).join("");


        console.log("Faculty information loaded.");

    }

    catch (error) {

        console.error("Faculty Error:", error);

    }

}


// ======================================================
// 14. LOAD CLASSROOM INFORMATION
// ======================================================

async function loadClassrooms() {

    try {

        const data = await fetchAPI("/api/classrooms");


        const list = document.getElementById(
            "classroomList"
        );


        document.getElementById(
            "classroomCount"
        ).textContent = `${data.length} Rooms`;


        list.innerHTML = data.map(item => `

            <li>

                <span>

                    ${escapeHTML(item.room_id)}

                    - ${escapeHTML(item.room_type)}

                </span>

                <strong>

                    Capacity: ${escapeHTML(item.capacity)}

                </strong>

            </li>

        `).join("");


        console.log("Classroom information loaded.");

    }

    catch (error) {

        console.error("Classroom Error:", error);

    }

}


// ======================================================
// 15. SIDEBAR NAVIGATION
// ======================================================

function setupNavigation() {

    const links = document.querySelectorAll(".nav-link");


    links.forEach(link => {

        link.addEventListener("click", () => {

            links.forEach(item => {

                item.classList.remove("active");

            });


            link.classList.add("active");

        });

    });

}


// ======================================================
// 16. INITIALISE DASHBOARD
// ======================================================

async function initialiseDashboard() {

    console.log("Starting CampusOpti AI Dashboard...");


    await Promise.all([

        loadDashboard(),

        loadAlgorithms(),

        loadTimetable(),

        loadUnscheduled(),

        loadFaculty(),

        loadClassrooms()

    ]);


    console.log(
        "CampusOpti AI Dashboard Initialised Successfully!"
    );

}


// ======================================================
// 17. EVENT LISTENERS
// ======================================================

document.addEventListener("DOMContentLoaded", () => {


    // Batch filter

    document.getElementById(
        "batchFilter"
    ).addEventListener(

        "change",

        filterTimetable

    );


    // Day filter

    document.getElementById(
        "dayFilter"
    ).addEventListener(

        "change",

        filterTimetable

    );


    // CSV download

    document.getElementById(
        "downloadTimetable"
    ).addEventListener(

        "click",

        downloadTimetable

    );


    // Sidebar navigation

    setupNavigation();


    // Start dashboard

    initialiseDashboard();


});
