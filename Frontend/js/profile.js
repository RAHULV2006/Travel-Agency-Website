const API_URL = "http://localhost:5000";

const loggedUser = localStorage.getItem("cinevistaUser");
const userEmail = localStorage.getItem("userEmail");

console.log("Logged User :", loggedUser);
console.log("User Email :", userEmail);
// Check login

if (
    !loggedUser ||
    loggedUser === "undefined" ||
    loggedUser === "null"
) {

    alert("Please login first.");

    window.location.href = "login.html";

}

// DOM Elements
const userName = document.getElementById("userName");
const userUsername =
document.getElementById("userUsername");
const userEmailText = document.getElementById("userEmail");
const userPhone = document.getElementById("userPhone");

const totalBookings =
document.getElementById("totalBookings");

const upcomingTrips =
document.getElementById("upcomingTrips");

const completedTrips =
document.getElementById("completedTrips");

const cancelledTrips =
document.getElementById("cancelledTrips");

const bookingTable =
document.getElementById("bookingTable");

const loadingSpinner =
document.getElementById("loadingSpinner");

// ============================================
// SHOW LOADING
// ============================================

function showLoading(){

    loadingSpinner.style.display="flex";

}

// ============================================
// HIDE LOADING
// ============================================

function hideLoading(){

    loadingSpinner.style.display="none";

}

// ============================================
// LOAD USER PROFILE
// ============================================

async function loadProfile(){
    

    try{

        showLoading();

        const response =
        await fetch(
        `${API_URL}/profile/${userEmail}`
        );

        const data =
        await response.json();
        console.log(data.user);

        hideLoading();

        if(!data.success){

            alert("Unable to load profile");

            return;

        }

userName.textContent = data.user.fullname;
userUsername.innerHTML =
data.user.fullname;
userEmailText.textContent = data.user.email;
userPhone.textContent = data.user.phone;
    }

    catch(error){

        hideLoading();

        console.log(error);

        alert("Server Error");

    }

}

// ============================================
// LOAD BOOKINGS
// ============================================

async function loadBookings(){

    try{

        showLoading();

        const response =
        await fetch(
        `${API_URL}/mybookings/${userEmail}`
        );

        const data =
        await response.json();

        hideLoading();

        if(!data.success){

            bookingTable.innerHTML=
            "<tr><td colspan='10'>No bookings found.</td></tr>";

            return;

        }

        displayBookings(data.bookings);

        dashboard(data.bookings);
 allBookings = data.bookings;
    }

    catch(error){

        hideLoading();

        console.log(error);

    }

}

// ============================================
// DISPLAY BOOKINGS
// ============================================
function formatDate(date) {

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;

}
function displayBookings(bookings){

bookingTable.innerHTML="";

bookings.forEach((booking)=>{

bookingTable.innerHTML+=`


<tr>

<td>${booking.id}</td>

<td>${booking.bookingdate}</td>

<td>${formatDate(booking.travel_date)}</td>

<td>${booking.pickup}</td>

<td>${booking.destination}</td>

<td>${booking.package}</td>

<td>${booking.vehicle}</td>

<td>

<span class="status ${booking.status.toLowerCase()}">

${booking.status}

</span>

</td>

<td>

${booking.paymentstatus}

</td>

<td>

<div class="action-buttons">

<button
class="viewBtn"
onclick="viewBooking(${booking.id})">

<i class="fas fa-eye"></i>

View Details

</button>

${booking.status!="Cancelled" && booking.paymentstatus=="Pending" ? `

<button
class="cancelBtn"
onclick="cancelBooking(${booking.id})">

<i class="fas fa-times-circle"></i>

Cancel Trip

</button>

<button
class="payBtn"
onclick="openPayment(${booking.id})">

<i class="fas fa-credit-card"></i>

Pay Now

</button>

` : ""}

${booking.paymentstatus=="Paid" ? `

<button
class="receiptBtn"
onclick="downloadReceipt(${booking.id})">

<i class="fas fa-file-pdf"></i>

Receipt

</button>

` : ""}

</div>

</td>

</tr>

`;

});

}


// DASHBOARD COUNTS
// ============================================

function dashboard(bookings){

    // Total Bookings
    totalBookings.innerHTML = bookings.length;

    // Upcoming Trips (Upcoming + Confirmed)
    upcomingTrips.innerHTML = bookings.filter(

        b => b.status === "Upcoming" ||
             b.status === "Confirmed"

    ).length;

    // Completed Trips
    completedTrips.innerHTML = bookings.filter(

        b => b.status === "Completed"

    ).length;

    // Cancelled Trips
    cancelledTrips.innerHTML = bookings.filter(

        b => b.status === "Cancelled"

    ).length;

}

// ============================================
// INITIAL LOAD
// ===========================================

// ============================================
// PROFILE.JS (Part 2)
// Search, Filter, Modal, Print
// ============================================

// Search Box
const searchBooking =
document.getElementById("searchBooking");

// Status Filter
const statusFilter =
document.getElementById("statusFilter");

// Store all bookings
let allBookings = [];

// ============================================
// UPDATE loadBookings()
// Replace displayBookings(...) with this
// ============================================

// After:
// displayBookings(data.bookings);
// dashboard(data.bookings);


// ============================================
// SEARCH BOOKINGS
// ============================================

if(searchBooking){

searchBooking.addEventListener("keyup",function(){

const value =
this.value.toLowerCase();

const filtered =
allBookings.filter(booking=>{

return(

booking.destination
.toLowerCase()
.includes(value)

||

booking.pickup
.toLowerCase()
.includes(value)

||

booking.vehicle
.toLowerCase()
.includes(value)

||

booking.package_name
.toLowerCase()
.includes(value)

);

});

displayBookings(filtered);

});

}


// ============================================
// FILTER BOOKINGS
// ============================================

if(statusFilter){

statusFilter.addEventListener("change",function(){

const status =
this.value;

if(status===""){

displayBookings(allBookings);

return;

}

const filtered =
allBookings.filter(booking=>

booking.status===status

);

displayBookings(filtered);

});

}


// ============================================
// VIEW BOOKING DETAILS
// ============================================

function viewBooking(id){

const booking =
allBookings.find(b=>b.id==id);

if(!booking){

return;

}

const modal =
document.getElementById("bookingModal");

const details =
document.getElementById("bookingDetails");

details.innerHTML=`

<h3>Booking #${booking.id}</h3>

<hr><br>

<p><b>Pickup :</b> ${booking.pickup}</p>

<p><b>Destination :</b> ${booking.destination}</p>

<p><b>Package :</b> ${booking.package}</p>

<p><b>Vehicle :</b> ${booking.vehicle}</p>

<p><b>Travel Date :</b> ${formatDate(booking.travel_date)}</p>

<p><b>Status :</b> ${booking.status}</p>

<p><b>Payment :</b> ${booking.paymentstatus}</p>

`;

modal.style.display="flex";

}


// ============================================
// CLOSE MODAL
// ============================================

function closeBookingModal(){

document.getElementById(
"bookingModal"
).style.display="none";

}


// ============================================
// CLICK OUTSIDE MODAL
// ============================================

window.onclick=function(event){

const modal=
document.getElementById("bookingModal");

if(event.target===modal){

modal.style.display="none";

}

}


// ============================================
// PRINT BOOKING
// ============================================

function printBooking(){

const content =
document.getElementById(
"bookingDetails"
).innerHTML;

const printWindow =
window.open("","","width=800,height=600");

printWindow.document.write(`

<html>

<head>

<title>Booking Receipt</title>

<style>

body{

font-family:Arial;

padding:30px;

}

h3{

color:#0077b6;

}

p{

font-size:18px;

margin:10px 0;

}

</style>

</head>

<body>

${content}

</body>

</html>

`);

printWindow.document.close();

printWindow.print();

}


// ============================================
// DOWNLOAD RECEIPT
// ============================================

function downloadReceipt(id){

    window.open(

        `${API_URL}/receipt/${id}`,

        "_blank"

    );

}
// ============================================
// PROFILE.JS (Part 3)
// Logout, Edit Profile, Helpers
// ============================================

// ===============================
// LOGOUT
// ===============================

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",function(){

const confirmLogout =
confirm("Are you sure you want to logout?");

if(confirmLogout){

// Clear Local Storage

localStorage.removeItem("cinevistaUser");
localStorage.removeItem("userEmail");
localStorage.removeItem("userId");
localStorage.removeItem("username");

// Redirect

window.location.href="login.html";

}

});

}


// ===============================
// NOTIFICATION CLICK
// ===============================

document.querySelectorAll(".notification").forEach(item=>{

item.addEventListener("click",function(){

this.classList.remove("unread");

const badge=this.querySelector(".badge");

if(badge){

badge.remove();

}

});

});

// ===============================
// REFRESH BOOKINGS
// ===============================

async function refreshBookings(){

await loadBookings();

}


// ===============================
// PAGE LOADED
// ===============================

window.addEventListener("load",function(){

console.log("Profile Loaded Successfully");

});

// ===============================
// ERROR HANDLER
// ===============================

window.addEventListener("error",function(e){

console.log("JavaScript Error :",e.message);

});

// ===============================
// SUCCESS MESSAGE
// ===============================

function showSuccess(message){

alert(message);

}

// ===============================
// ERROR MESSAGE
// ===============================

function showError(message){

alert(message);

}
// ===============================
// PAGE LOADED
// ===============================

window.addEventListener("load", async function () {

    console.log("Profile Loaded Successfully");

    await loadProfile();

    await loadBookings();

});

async function cancelBooking(id){

    const confirmCancel = confirm(
        "Are you sure you want to cancel this trip?"
    );

    if(!confirmCancel){

        return;

    }

    try{

        const response = await fetch(

            `${API_URL}/cancelBooking/${id}`,

            {

                method:"PUT"

            }

        );

        const data = await response.json();

        alert(data.message);

        loadBookings();

    }

    catch(error){

        console.log(error);

        alert("Unable to cancel booking.");

    }

}
function openEditModal(){

    document.getElementById("editProfileModal").style.display="flex";

    document.getElementById("editName").value =
    userName.innerText;

    document.getElementById("editEmail").value =
    userEmailText.innerText;

    document.getElementById("editPhone").value =
    userPhone.innerText;

}

function closeEditModal(){

    document.getElementById("editProfileModal").style.display="none";

}
document.getElementById("editProfileForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const fullname =
    document.getElementById("editName").value;

    const email =
    document.getElementById("editEmail").value;

    const phone =
    document.getElementById("editPhone").value;

    try{

        const response =
        await fetch(

            "http://localhost:5000/updateProfile",

            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    oldEmail:userEmail,

                    fullname,
                    email,
                    phone

                })

            }

        );

        const data =
        await response.json();

        alert(data.message);

        if(data.success){

            localStorage.setItem(
                "userEmail",
                email
            );

            closeEditModal();

            loadProfile();

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to update profile.");

    }

});
let paymentBookingId=null;

function openPayment(id){

    paymentBookingId=id;

    document.getElementById(
    "paymentBookingId"
    ).value=id;

    document.getElementById(
    "paymentModal"
    ).style.display="flex";

}

function closePayment(){

    document.getElementById(
    "paymentModal"
    ).style.display="none";

}
async function confirmPayment(){

    const method=document.getElementById(
    "paymentMethod"
    ).value;

    try{

        const response=await fetch(

        `${API_URL}/payBooking`,

        {

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                id:paymentBookingId,

                paymentMethod:method

            })

        }

        );

        const data=await response.json();

        alert(data.message);

        if(data.success){

            closePayment();

            loadBookings();

            loadDashboard();

        }

    }

    catch(err){

        console.log(err);

        alert("Payment Failed");

    }

}
console.log("CineVista Travels Profile Dashboard Ready.");