let attendance =
JSON.parse(localStorage.getItem("attendance")) || [];

let workers =
JSON.parse(localStorage.getItem("workers")) || [];

loadWorkers();
loadReport();

function loadWorkers() {

let select = document.getElementById("workerFilter");

select.innerHTML = `<option value="">બધા કારીગર</option>`;

workers.forEach(worker => {

select.innerHTML += `
<option value="${worker.name}">
${worker.name}
</option>
`;

});

}

function loadReport() {

let month = document.getElementById("month").value;
let workerFilter = document.getElementById("workerFilter").value;

let report = {};

attendance.forEach(a => {

if (
(month == "" || a.date.substring(0,7) == month) &&
(workerFilter == "" || a.workerName == workerFilter)
) {

if (!report[a.workerName]) {

report[a.workerName] = {
hours: 0,
salary: 0,
days: 0
};

}

report[a.workerName].hours += Number(a.hours);
report[a.workerName].salary += Number(a.salary);
report[a.workerName].days++;

}

});

let list = document.getElementById("reportList");

list.innerHTML = "";

let grandTotal = 0;

for (let worker in report) {

grandTotal += report[worker].salary;

list.innerHTML += `

<div class="list-card">

<h3>👷 ${worker}</h3>

<p>📅 હાજરી: ${report[worker].days} દિવસ</p>

<p>⏱️ કુલ કલાક: ${report[worker].hours}</p>

<p>💰 કુલ પગાર: ₹${report[worker].salary}</p>

</div>

`;

}

if (Object.keys(report).length === 0) {

list.innerHTML = `
<div class="list-card">
<h3>કોઈ રેકોર્ડ મળ્યો નથી.</h3>
</div>
`;

return;

}

list.innerHTML += `

<div class="list-card">

<h2>કુલ ચૂકવવાનો પગાર</h2>

<h2 style="color:green;">₹${grandTotal}</h2>

</div>

`;

}