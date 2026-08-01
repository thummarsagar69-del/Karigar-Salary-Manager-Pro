// ===============================
// Attendance.js Part 1A
// ===============================

let workers = JSON.parse(localStorage.getItem("workers")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

let editIndex = -1;

// ----------------------------
// Load Worker Dropdown
// ----------------------------
function loadWorkers() {

    const worker = document.getElementById("worker");
    const workerFilter = document.getElementById("workerFilter");

    worker.innerHTML =
        '<option value="">કારીગર પસંદ કરો</option>';

    if (workerFilter) {

        workerFilter.innerHTML =
            '<option value="">બધા કારીગર</option>';

    }

    workers.forEach((w, index) => {

        worker.innerHTML += `
        <option value="${index}">
            ${w.name}
        </option>`;

        if (workerFilter) {

            workerFilter.innerHTML += `
            <option value="${w.id}">
                ${w.name}
            </option>`;

        }

    });

}

// ----------------------------
// Hour Rate
// ----------------------------
function setRate() {

    const index =
        document.getElementById("worker").value;

    if (index === "") {

        rate.value = "";
        salary.value = "";

        return;

    }

    rate.value = workers[index].rate;

    calculateSalary();

}

// ----------------------------
// Salary
// ----------------------------
function calculateSalary() {

    let hrs =
        Number(document.getElementById("hours").value);

    let rt =
        Number(document.getElementById("rate").value);

    document.getElementById("salary").value =
        hrs * rt;

}

// ----------------------------
// Save Attendance
// ----------------------------
function saveAttendance() {

    const workerIndex =
        document.getElementById("worker").value;

    if (workerIndex === "") {

        alert("કારીગર પસંદ કરો");

        return;

    }

    const date =
        document.getElementById("date").value;

    const duplicate =
        attendance.find((a, i) =>

            a.workerId ==
            workers[workerIndex].id &&

            a.date == date &&

            i != editIndex

        );

    if (duplicate) {

        alert("આ તારીખની હાજરી પહેલેથી સેવ થઈ ગઈ છે.");

        return;

    }

    let record = {

        id:
            editIndex == -1
                ? Date.now()
                : attendance[editIndex].id,

        date: date,

        workerId:
            workers[workerIndex].id,

        workerName:
            workers[workerIndex].name,

        hours:
            Number(hours.value),

        rate:
            Number(rate.value),

        salary:
            Number(salary.value)

    };

    if (editIndex == -1) {

        attendance.push(record);

    } else {

        attendance[editIndex] = record;

        editIndex = -1;

    }

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    clearAttendanceForm();

    loadAttendance();

    loadWeeklyAttendance();

    alert("હાજરી સફળતાપૂર્વક સેવ થઈ ગઈ.");

}

// ===============================
// Attendance.js Part 1B
// ===============================

// ---------- Clear Form ----------
function clearAttendanceForm() {

    document.getElementById("worker").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("hours").value = "";
    document.getElementById("salary").value = "";

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

}

// ---------- Edit Attendance ----------
function editAttendance(index) {

    let a = attendance[index];

    editIndex = index;

    document.getElementById("date").value = a.date;

    document.getElementById("hours").value = a.hours;

    document.getElementById("rate").value = a.rate;

    document.getElementById("salary").value = a.salary;

    let workerIndex =
        workers.findIndex(w => w.id == a.workerId);

    document.getElementById("worker").value =
        workerIndex;

}

// ---------- Delete ----------
function deleteAttendance(index) {

    if (!confirm("હાજરી Delete કરવી છે?"))
        return;

    attendance.splice(index, 1);

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    loadAttendance();

    loadWeeklyAttendance();

}

// ---------- Attendance List ----------
function loadAttendance() {

    

    attendance.sort((a, b) =>
        b.date.localeCompare(a.date)
    );

    attendance.forEach((a, index) => {

        list.innerHTML += `

        <div class="list-card">

            <h3>${a.workerName}</h3>

            <p>📅 ${a.date}</p>

            <p>⏱ ${a.hours} કલાક</p>

            <p>💰 ₹${a.salary}</p>

            <div style="display:flex;gap:8px;flex-wrap:wrap;">

                <button
                onclick="editAttendance(${index})">

                ✏️ Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteAttendance(${index})">

                🗑 Delete

                </button>

            </div>

        </div>

        `;

    });

}


// ===============================
// Attendance.js Part 2
// Weekly Attendance
// ===============================

// અઠવાડિયાની તારીખો
function getWeekDates() {

    let start = new Date();

    let day = start.getDay();

    let diff = (day === 0 ? -6 : 1 - day);

    start.setDate(start.getDate() + diff);

    start.setHours(0,0,0,0);

    let dates = [];

    for(let i=0;i<7;i++){

        let d=new Date(start);

        d.setDate(start.getDate()+i);

        dates.push(d);

    }

    return dates;

}

// Weekly Table
function loadWeeklyAttendance(){

    const tbody =
    document.getElementById("weeklyBody");

    if(!tbody) return;

    tbody.innerHTML="";

    const dates=getWeekDates();

    updateWeekHeader(dates);

    let workerFilter="";

    if(document.getElementById("workerFilter")){

        workerFilter=
        document.getElementById("workerFilter").value;

    }

    workers.forEach(worker=>{

        if(workerFilter!="" &&
        worker.id!=workerFilter){

            return;

        }

        let row=`<tr>`;

        row+=`<td><b>${worker.name}</b></td>`;

        let totalHours=0;

        let totalSalary=0;

        dates.forEach(d=>{

            let dateString=
            d.toISOString().split("T")[0];

            let rec=
            attendance.find(a=>

                a.workerId==worker.id &&
                a.date==dateString

            );

            if(rec){

                row+=`
                <td style="color:green;">
                ${rec.hours}
                </td>`;

                totalHours+=Number(rec.hours);

                totalSalary+=Number(rec.salary);

            }else{

                row+=`
                <td style="color:red;">
                -
                </td>`;

            }

        });

        row+=`
        <td><b>${totalHours}</b></td>

        <td><b>₹${totalSalary}</b></td>

        </tr>`;

        tbody.innerHTML+=row;

    });

}

// Header Date
function updateWeekHeader(dates){

    const row=
    document.getElementById("weekHeader");

    if(!row) return;

    const days=[
    "સોમ",
    "મંગળ",
    "બુધ",
    "ગુરુ",
    "શુક્ર",
    "શનિ",
    "રવિ"
    ];

    row.innerHTML="<th>કારીગર</th>";

    dates.forEach((d,index)=>{

        row.innerHTML+=`

        <th>

        ${d.toLocaleDateString("en-GB")}

        <br>

        ${days[index]}

        </th>

        `;

    });

    row.innerHTML+=`

    <th>કુલ કલાક</th>

    <th>કુલ પગાર</th>

    `;

}


// ===============================
// Attendance.js Part 3 (Final)
// ===============================

// ---------- Export Excel ----------
function exportExcel() {

    let table = document.getElementById("weeklyTable");

    if (!table) {
        alert("ટેબલ મળ્યું નથી.");
        return;
    }

    let workbook = XLSX.utils.table_to_book(table, {
        sheet: "Attendance"
    });

    XLSX.writeFile(
        workbook,
        "Weekly_Attendance.xlsx"
    );

}


// ---------- Export PDF ----------
function exportPDF() {

    window.print();

}


// ---------- Search Worker ----------
function searchWorker() {

    let txt = document
        .getElementById("searchWorker")
        .value
        .toLowerCase();

    document
        .querySelectorAll("#weeklyBody tr")
        .forEach(row => {

            row.style.display =
                row.innerText
                .toLowerCase()
                .includes(txt)
                ? ""
                : "none";

        });

}


// ---------- Set Current Week ----------
function setCurrentWeek() {

    let today = new Date();

    let first =
        new Date(today);

    let day = first.getDay();

    let diff =
        first.getDate() -
        day +
        (day == 0 ? -6 : 1);

    first.setDate(diff);

    if (document.getElementById("weekFilter")) {

        let year =
            first.getFullYear();

        let week =
            getWeekNumber(first);

        document
            .getElementById("weekFilter")
            .value =
            year +
            "-W" +
            String(week)
            .padStart(2, "0");

    }

}


// ---------- Week Number ----------
function getWeekNumber(date) {

    let d =
        new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));

    d.setUTCDate(
        d.getUTCDate() +
        4 -
        (d.getUTCDay() || 7)
    );

    let yearStart =
        new Date(
            Date.UTC(
                d.getUTCFullYear(),
                0,
                1
            )
        );

    return Math.ceil(

        (
            (
                (
                    d -
                    yearStart
                ) /
                86400000
            ) +
            1
        ) / 7

    );

}


// ---------- Page Load ----------
document.addEventListener(

    "DOMContentLoaded",

    function () {

        if (
            document.getElementById("date")
        ) {

            document
                .getElementById("date")
                .value =
                new Date()
                .toISOString()
                .split("T")[0];

        }

        loadWorkers();

        loadAttendance();

        setCurrentWeek();

        loadWeeklyAttendance();

    }

);