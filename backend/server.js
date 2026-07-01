console.log("SERVER FILE =", __filename);

const db = require("./db");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("NEW SERVER VERSION");
});


app.post("/contact", (req, res) => {

    console.log(req.body);

    const { name, email, phone, message } = req.body;

    const sql =
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, phone, message], (err, result) => {

        if(err){
            console.log(err);

            return res.json({
                message: "Database Error"
            });
        }

        res.json({
            message: "Thank you for contacting CineVista Travels!"
        });

    });

});
app.post("/booking", (req, res) => {

    const {
        name,
        phone,
        pickup,
        destination,
        packageName,
        vehicle,
        travelDate,
        email
    } = req.body;

    const sql = `
    INSERT INTO bookings
    (name, phone, pickup, destination, vehicle, travel_date, package, email, status, paymentstatus, bookingdate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            phone,
            pickup,
            destination,
            vehicle,
            travelDate,
            packageName,
            email,
            "Upcoming",
            "Pending",
            new Date().toLocaleDateString()
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.json({
                    success: false,
                    message: "Booking Failed"
                });

            }

            res.json({
                success: true,
                message: "Booking Confirmed Successfully"
            });

        }
    );

});

app.get("/mybookings/:email", (req, res) => {

    const email = req.params.email;

    const sql = `
    SELECT
        id,
        bookingdate,
        travel_date,
        pickup,
        destination,
        package,
        vehicle,
        status,
        paymentstatus
    FROM bookings
    WHERE email = ?
    ORDER BY id DESC
    `;

    db.query(sql, [email], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({
                success: false
            });

        }

        res.json({

            success: true,

            bookings: result

        });

    });

});
app.get("/profile/:email", (req, res) => {

    const email = req.params.email;

    const sql =
    "SELECT fullname, email, phone FROM register WHERE email=?";

    db.query(sql, [email], (err, result) => {

        if (err) {
            console.log(err);
            return res.json({
                success: false
            });
        }

        console.log("Database Result:", result);

        if (result.length > 0) {

            return res.json({
                success: true,
                user: {
                    fullname: result[0].fullname,
                    email: result[0].email,
                    phone: result[0].phone
                }
            });

        } else {

            return res.json({
                success: false,
                message: "User not found"
            });

        }

    });

});
app.get("/bookings/:username",(req,res)=>{

    const username=req.params.username;

    const sql=

    `

    SELECT

    id,

    travelDate,

    destination,

    vehicle,

    status,

    paymentStatus,

    bookingDate,

    pickup,

    packageName

    FROM bookings

    WHERE username=?

    ORDER BY id DESC

    `;

    db.query(sql,[username],(err,result)=>{

        if(err){

            console.log(err);

            return res.status(500).json([]);

        }

        res.json(result);

    });

});


app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
    "SELECT * FROM register WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            console.log(err);

            return res.json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length > 0) {

            return res.json({

                success: true,

                message: "Login Successful",

                user: {

                    id: result[0].id,

                    fullname: result[0].fullname,

                    email: result[0].email,

                    phone: result[0].phone

                }

            });

        } else {

            return res.json({

                success: false,

                message: "Invalid Email or Password"

            });

        }

    });

});
app.post("/logout",(req,res)=>{

    res.json({

        success:true,

        message:"Logout Successful"

    });

});
app.post("/register", (req, res) => {

    const { fullname, email, password } = req.body;

    const checkSql =
    "SELECT * FROM register WHERE email=?";

    db.query(checkSql, [email], (err, result) => {

        if(err){
            return res.json({
                success: false,
                message: "Database Error"
            });
        }

        if(result.length > 0){
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        const insertSql =
        "INSERT INTO register(fullname,email,password) VALUES(?,?,?)";

        db.query(insertSql,
        [fullname, email, password],
        (err, result) => {

            if(err){
                return res.json({
                    success: false,
                    message: "Registration Failed"
                });
            }

            res.json({
                success: true,
                message: "Registration Successful"
            });

        });

    });

});

app.put("/cancelBooking/:id", (req,res)=>{

    const id = req.params.id;

    const sql =

    "UPDATE bookings SET status='Cancelled' WHERE id=?";

    db.query(sql,[id],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,

                message:"Unable to cancel trip."

            });

        }

        res.json({

            success:true,

            message:"Trip cancelled successfully."

        });

    });

});

app.put("/updateProfile", (req, res) => {

    const {

        oldEmail,
        fullname,
        email,
        phone

    } = req.body;

    const sql = `
    UPDATE register
    SET fullname=?,
        email=?,
        phone=?
    WHERE email=?
    `;

    db.query(

        sql,

        [

            fullname,
            email,
            phone,
            oldEmail

        ],

        (err, result) => {

            if(err){

                console.log(err);

                return res.json({

                    success:false,

                    message:"Unable to update profile."

                });

            }

            res.json({

                success:true,

                message:"Profile updated successfully."

            });

        }

    );

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});