let workers = JSON.parse(localStorage.getItem("workers")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function loadWorkers() {

    const select = document.getElementById("worker");

    select.innerHTML =
    '<option value="">કારીગર પસંદ કરો</option>';

    workers.forEach((w, index) => {

        select.innerHTML +=
        `<option value="${index}">
        ${w.name}
        </option>`;

    });

}

function setRate() {

    const index = document.getElementById("worker").value;

    if(index===""){

        rate.value="";
        salary.value="";
        return;

    }

    rate.value = workers[index].rate;

    calculateSalary();

}

function calculateSalary(){

    const hours = Number(document.getElementById("hours").value);

    const rateValue = Number(document.getElementById("rate").value);

    document.getElementById("salary").value =
    hours * rateValue;

}

function saveAttendance(){

    const workerIndex =
    document.getElementById("worker").value;

    if(workerIndex===""){

        alert("કારીગર પસંદ કરો");

        return;

    }

    const date =
    document.getElementById("date").value;

    const duplicate =
    attendance.find(a =>
    a.date===date &&
    a.workerId==workers[workerIndex].id);

    if(duplicate){

        alert("આ કારીગરની આજની હાજરી પહેલેથી સેવ છે.");

        return;

    }

    const record={

        id:Date.now(),

        date:date,

        workerId:workers[workerIndex].id,

        workerName:workers[workerIndex].name,

        hours:Number(hours.value),

        rate:Number(rate.value),

        salary:Number(salary.value)

    };

    attendance.push(record);

    localStorage.setItem(
    "attendance",
    JSON.stringify(attendance));

    alert("હાજરી સેવ થઈ ગઈ.");

    loadAttendance();
loadWeeklyAttendance();

}

function loadAttendance(){

    const list =
    document.getElementById("attendanceList");

    list.innerHTML="";

    attendance
    .sort((a,b)=>b.date.localeCompare(a.date))
    .forEach((a,index)=>{

        list.innerHTML+=`

        <div class="list-card">

        <h3>${a.workerName}</h3>

        <p>📅 ${a.date}</p>

        <p>⏱️ ${a.hours} કલાક</p>

        <p>💰 ₹${a.salary}</p>

        <button class="delete-btn"
        onclick="deleteAttendance(${index})">

        Delete

        </button>

        </div>

        `;

    });

}

function loadWeeklyAttendance() {

let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let workers = JSON.parse(localStorage.getItem("workers")) || [];

let tbody = document.getElementById("weeklyBody");

tbody.innerHTML = "";

workers.forEach(worker => {

let row = `
<tr>
<td>${worker.name}</td>
`;

let totalHours = 0;
let totalSalary = 0;

for (let i = 0; i < 7; i++) {

let record = attendance.find(a =>
a.worker == worker.name &&
new Date(a.date).getDay() == ((i + 1) % 7)
);

if (record) {

row += `<td>${record.hours}</td>`;

totalHours += Number(record.hours);
totalSalary += Number(record.salary);

} else {

row += `<td>-</td>`;

}

}

row += `
<td>${totalHours}</td>
<td>₹${totalSalary}</td>
</tr>
`;

tbody.innerHTML += row;

});

}

function deleteAttendance(index){

    if(confirm("હાજરી Delete કરવી છે?")){

        attendance.splice(index,1);

        localStorage.setItem(
        "attendance",
        JSON.stringify(attendance));

        loadAttendance();

    }

}
document.getElementById("date").value =
new Date().toISOString().split("T")[0];

loadWorkers();
loadAttendance();
loadWeeklyAttendance();