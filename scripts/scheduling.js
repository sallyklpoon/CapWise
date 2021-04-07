// initialization stuffs
let today = new Date();
let last_day_picked = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
let is_message_present = false;
let last_week = document.createElement("h1");
let last_week_area = document.getElementById("above_notes");
last_week.setAttribute("id", "last_weeks_numbers");
last_week_area.appendChild(last_week);
change_employee_numbers();
reset_modal_numbers();
assign_button_number_and_id();
dates_on_base_screen();

// assigns each button and number on the first schedule screen to a date
function assign_button_number_and_id() {
    let arrow_buttons = document.getElementsByClassName('arrow_button');
    let h2_employee_numbers = document.querySelectorAll('h2');
    let today = new Date();
    for (let i = 0; i < 7; i++) {
        let new_day = new Date(today);
        new_day.setDate(new_day.getDate() + i);
        let new_id = new_day.getFullYear() + "-" + new_day.getMonth() + "-" + new_day.getDate();
        arrow_buttons[i].setAttribute('id', new_id)
        h2_employee_numbers[i].setAttribute('id', new_id)
    }
}

// puts dates into a 7 member array
function current_date() {
    new_array = [];

    let loop_counter = 0;
    while (loop_counter < 7) {
        new_array.push(apply_dates(loop_counter));
        loop_counter++;
    }
    return new_array;
}

// creates dates
function apply_dates(counter) {
    today = new Date();
    new_day = new Date(today);
    new_day.setDate(new_day.getDate() + counter);
    var mmm = new_day.getMonth();
    var dd = new_day.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mmm == 0) mmm = 'JAN';
    if (mmm == 1) mmm = 'FEB';
    if (mmm == 2) mmm = 'MAR';
    if (mmm == 3) mmm = 'APR';
    if (mmm == 4) mmm = 'MAY';
    if (mmm == 5) mmm = 'JUN';
    if (mmm == 6) mmm = 'JUL';
    if (mmm == 7) mmm = 'AUG';
    if (mmm == 8) mmm = 'SEP';
    if (mmm == 9) mmm = 'OCT';
    if (mmm == 10) mmm = 'NOV';
    if (mmm == 11) mmm = 'DEC';

    return (mmm + ', ' + dd);
}

// makes an array of weekdays
function make_weekday() {
    today = new Date();
    new_array = [];
    loop_counter = 0;

    while (loop_counter < 7) {
        new_day = new Date(today);
        new_day.setDate(new_day.getDate() + loop_counter);
        name_of_day = new_day.getDay();
        if (name_of_day == 0) name_of_day = 'SUN';
        if (name_of_day == 1) name_of_day = 'MON';
        if (name_of_day == 2) name_of_day = 'TUE';
        if (name_of_day == 3) name_of_day = 'WED';
        if (name_of_day == 4) name_of_day = 'THU';
        if (name_of_day == 5) name_of_day = 'FRI';
        if (name_of_day == 6) name_of_day = 'SAT';
        new_array.push(name_of_day);
        loop_counter++;
    }
    return new_array;
}

// opens a new message field in the modal. Also creates a listener for the confirm button to send to DB
function new_message_field() {
    if (is_message_present == false) {
        is_message_present = true;
        let new_div = document.createElement("div");
        let confirm_button = document.createElement("button");
        let button_image = document.createElement("img");
        let new_field = document.createElement("textarea");
        let message_area = document.getElementById("box_field");
        confirm_button.setAttribute("id", "form-submit-button");
        new_div.setAttribute("id", "new_form_div");
        button_image.setAttribute("id", "image_for_confirm_button");
        button_image.src = "./images/icons/check-circle.svg";
        new_field.setAttribute("id", "message");
        new_div.appendChild(new_field);
        confirm_button.appendChild(button_image);
        new_div.appendChild(confirm_button);
        message_area.appendChild(new_div);

        confirm_button.addEventListener('click', function (event) {
            send_notes_to_db();
            let message_area = document.getElementById("area_for_notes");
            let new_message_to_add = document.createElement("p");
            new_message_to_add.setAttribute("class", "new_message");
            new_message_to_add.appendChild(document.createTextNode(new_field.value));
            message_area.appendChild(new_message_to_add);
            confirm_button.parentNode.remove();
            is_message_present = false;
        });
    }
}

// applies correct dates and weekday names to base screen
function dates_on_base_screen() {
    let date_array = current_date();
    let weekdays = make_weekday();
    let day_cards = document.getElementsByClassName("date-field");
    let weekday_cards = document.getElementsByClassName("weekday");

    for (let i = 0; i < 7; i++) {
        day_cards[i].innerHTML = date_array[i];
        weekday_cards[i].innerHTML = weekdays[i];
    }
}

// Get modal
var modal = document.getElementById("myModal");

// Get button that opens the modal
var btn = document.getElementsByClassName("arrow_button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal and get data from DB about that day
function open_message_popup(button_id) {
    modal.style.display = ("flex");
    last_day_picked = button_id;
    get_last_week_value();
    let docref = db.collection("employee_numbers").doc(last_day_picked)
    docref.get().then((doc) => {
        if (doc.exists) {
            console.log("Got doc for " + last_day_picked + " succesfully.")
        } else {
            db.collection("employee_numbers").doc(last_day_picked).set({
                employees: 0
            })
        }
    })

    db.collection("schedule_notes")
        .where("timestamp", "==", last_day_picked)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var note = doc.data().message;
                let new_message_to_add = document.createElement("p");
                let message_area = document.getElementById("area_for_notes");
                new_message_to_add.setAttribute("class", "new_message");
                new_message_to_add.appendChild(document.createTextNode(note));
                message_area.appendChild(new_message_to_add);
            });
        })
    reset_modal_numbers();
}

// When the user clicks on <span> (x), close the modal and update any changes they made to DB
span.onclick = function () {
    modal.style.display = "none";
    let new_message_to_add = document.getElementsByClassName('new_message');
    let original_message_count = new_message_to_add.length;
    for (let i = 0; i < original_message_count; i++) {
        new_message_to_add[0].remove();
    }
    change_employee_numbers();
    update_schedule();
}

// When the user clicks anywhere outside of the modal, close it and update any changes they made to DB
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        let new_message_to_add = document.getElementsByClassName('new_message');
        let original_message_count = new_message_to_add.length;
        for (let i = 0; i < original_message_count; i++) {
            new_message_to_add[0].remove();
        }
        change_employee_numbers();
        update_schedule();
    }
}

// add to the number of employees in the modal
function add_people() {
    let number_of_people = document.getElementById('number_of_staff');
    let new_number_of_people = parseInt(number_of_people.innerHTML) + 1;
    number_of_people.innerHTML = new_number_of_people;
}

// subtract the number of employees in the modal
function subtract_people() {
    let number_of_people = document.getElementById('number_of_staff');
    if (parseInt(number_of_people.innerHTML) > 0) {
        let new_number_of_people = parseInt(number_of_people.innerHTML) - 1;
        number_of_people.innerHTML = new_number_of_people;
    }
}

// changes the number of employees in the DB to the number the user has picked
function update_schedule() {
    let employees_today = document.getElementById('number_of_staff');
    db.collection("employee_numbers").doc(last_day_picked).set({
        timestamp: last_day_picked,
        employees: employees_today.textContent
    })

}

// changes employee numbers on the base schedule screen
function change_employee_numbers() {
    let new_number = document.querySelectorAll("h2");
    let today = new Date();

    for (let i = 0; i < 7; i++) {
        let new_day = new Date(today);
        new_day.setDate(new_day.getDate() + i);
        new_day = new_day.getFullYear() + "-" + new_day.getMonth() + "-" + new_day.getDate();
        let docref = db.collection("employee_numbers").doc(new_day);
        docref.get().then((doc) => {
            if (doc.exists) {
                new_number[i].innerHTML = doc.data().employees;
            } else {
                db.collection("employee_numbers").doc(new_day).set({
                    employees: 0
                })
                change_employee_numbers();
            }
        })
    }
}

// changes the modal number to the correct day
function reset_modal_numbers() {
    let employee_number = document.getElementById("number_of_staff");
    let docref = db.collection("employee_numbers").doc(last_day_picked)
    docref.get().then((doc) => {
        if (doc.exists) {
            employee_number.innerHTML = doc.data().employees;
        } else {
            db.collection("employee_numbers").doc(last_day_picked).set({
                employees: 0
            })
        }
    })
}

// sends user entered notes to the DB
function send_notes_to_db() {
    let new_note = document.querySelector('textarea');
    db.collection("schedule_notes").add({
        timestamp: last_day_picked,
        message: new_note.value
    })
}

function get_last_week_value() {
    let today = new Date();
    let new_day = new Date(today);
    let last_day_array = last_day_picked.split("-")
    new_day.setFullYear(parseInt(last_day_array[0]))
    new_day.setMonth(parseInt(last_day_array[1]))
    new_day.setDate(parseInt(last_day_array[2]) - 7)
    new_day = new_day.getFullYear() + "-" + new_day.getMonth() + "-" + new_day.getDate();
    console.log(new_day)
    let docref = db.collection("employee_numbers").doc(new_day);
    docref.get().then((doc) => {
        if (doc.exists) {
            let last_week_employees = doc.data().employees;
            last_week.innerHTML = last_week_employees;
        } else {
            db.collection("employee_numbers").doc(new_day).set({
                employees: 0
            })
            let last_week_employees = doc.data().employees;
            last_week.innerHTML = last_week_employees;
        }
    })
}