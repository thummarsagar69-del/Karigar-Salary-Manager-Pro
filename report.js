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
</option>`;

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
days: 0,
hours: 0,
salary: 0
};

}

report[a.workerName].days++;
report[a.workerName].hours += Number(a.hours);
report[a.workerName].salary += Number(a.salary);

}

});

let body = document.getElementById("reportBody");

body.innerHTML = "";

let grandTotal = 0;

let sr = 1;

for (let worker in report) {

grandTotal += report[worker].salary;

body.innerHTML += `

<tr>

<td>${sr++}</td>

<td>${worker}</td>

<td>${report[worker].days}</td>

<td>${report[worker].hours}</td>

<td>₹${report[worker].salary}</td>

<td>

<button class="action-btn"
onclick="printWorker('${worker}')">

🖨️ Print

</button>

</td>

</tr>

`;

}

if (Object.keys(report).length == 0) {

body.innerHTML = `

<tr>

<td colspan="6">

કોઈ રેકોર્ડ મળ્યો નથી.

</td>

</tr>

`;

}

document.getElementById("grandTotal").innerHTML =
`કુલ પગાર : <span style="color:green;">₹${grandTotal}</span>`;

}

function printWorker(workerName){

let month=document.getElementById("month").value;

let data=attendance.filter(a=>

(month=="" || a.date.substring(0,7)==month)

&& a.workerName==workerName

);

let totalHours=0;
let totalSalary=0;

data.forEach(d=>{

totalHours+=Number(d.hours);

totalSalary+=Number(d.salary);

});

let win=window.open("","_blank");

win.document.write(`

<html>

<head>

<title>${workerName}</title>

<style>

body{

font-family:Arial;

padding:20px;

}

table{

width:100%;

border-collapse:collapse;

}

th,td{

border:1px solid #000;

padding:8px;

text-align:center;

}

</style>

</head>

<body>

<h2>Prominent Technology</h2>

<h3>Salary Report</h3>

<p><b>કારીગર :</b> ${workerName}</p>

<p><b>મહિનો :</b> ${month || "બધા"}</p>

<table>

<tr>

<th>તારીખ</th>

<th>કલાક</th>

<th>પગાર</th>

</tr>

${data.map(d=>`

<tr>

<td>${d.date}</td>

<td>${d.hours}</td>

<td>₹${d.salary}</td>

</tr>

`).join("")}

</table>

<h3>કુલ કલાક : ${totalHours}</h3>

<h3>કુલ પગાર : ₹${totalSalary}</h3>

</body>

</html>

`);

win.document.close();

win.print();

}