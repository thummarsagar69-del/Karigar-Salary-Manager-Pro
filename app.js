// js/app.js

let workers = JSON.parse(localStorage.getItem("workers")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function loadDashboard() {

    // કુલ કારીગર
    document.getElementById("totalWorkers").innerText = workers.length;

    // આજની તારીખ
    const today = new Date().toISOString().split("T")[0];

    // ચાલુ મહિનો
    const month = today.substring(0,7);

    let todayAttendance = 0;
    let todaySalary = 0;
    let monthSalary = 0;

    attendance.forEach(a => {

        if(a.date === today){

            todayAttendance++;
            todaySalary += Number(a.salary);

        }

        if(a.date.substring(0,7) === month){

            monthSalary += Number(a.salary);

        }

    });

    document.getElementById("todayAttendance").innerText = todayAttendance;
    document.getElementById("todaySalary").innerText = "₹" + todaySalary;
    document.getElementById("monthSalary").innerText = "₹" + monthSalary;

}

loadDashboard();