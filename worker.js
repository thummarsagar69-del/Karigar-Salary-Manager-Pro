let workers = JSON.parse(localStorage.getItem("workers")) || [];
let editIndex = -1;

function saveWorker() {

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const work = document.getElementById("work").value.trim();
    const rate = Number(document.getElementById("rate").value);

    if (!name || !mobile || !work || rate <= 0) {
        alert("બધી માહિતી ભરો.");
        return;
    }

    // Duplicate Mobile Check
    const duplicate = workers.find((w, i) =>
        w.mobile === mobile && i !== editIndex
    );

    if (duplicate) {
        alert("આ મોબાઇલ નંબર પહેલેથી જ છે.");
        return;
    }

    const worker = {
        id: Date.now(),
        name,
        mobile,
        work,
        rate
    };

    if (editIndex === -1) {
        workers.push(worker);
    } else {
        worker.id = workers[editIndex].id;
        workers[editIndex] = worker;
        editIndex = -1;
    }

    localStorage.setItem("workers", JSON.stringify(workers));

    clearForm();
    loadWorkers();
}

function loadWorkers() {

    const list = document.getElementById("workerList");
    list.innerHTML = "";

    workers.forEach((w, index) => {

        list.innerHTML += `
        <div class="list-card">

            <h3>${w.name}</h3>

            <p>📱 ${w.mobile}</p>

            <p>🛠️ ${w.work}</p>

            <p>💰 ₹${w.rate}/કલાક</p>

            <div class="action-btn">

                <button class="edit-btn"
                onclick="editWorker(${index})">
                ✏️ Edit
                </button>

                <button class="delete-btn"
                onclick="deleteWorker(${index})">
                🗑 Delete
                </button>

            </div>

        </div>`;
    });

}

function editWorker(index){

    const w = workers[index];

    document.getElementById("name").value = w.name;
    document.getElementById("mobile").value = w.mobile;
    document.getElementById("work").value = w.work;
    document.getElementById("rate").value = w.rate;

    editIndex = index;
}

function clearForm(){

    document.getElementById("name").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("work").value = "";
    document.getElementById("rate").value = "";

}

function deleteWorker(index) {

    if (confirm("કારીગર Delete કરવો છે?")) {

        workers.splice(index, 1);

        localStorage.setItem("workers",
        JSON.stringify(workers));

        loadWorkers();

    }

}

function searchWorker() {

    const text = document.getElementById("search")
    .value.toLowerCase();

    const cards = document.querySelectorAll(".list-card");

    cards.forEach(card => {

        card.style.display =
        card.innerText.toLowerCase().includes(text)
        ? "block" : "none";

    });

}


loadWorkers();