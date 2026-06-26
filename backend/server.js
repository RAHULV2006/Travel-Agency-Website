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

    console.log("Booking Data:", req.body);

    const {
        name,
        phone,
        pickup,
        destination,
        packageName,
        vehicle,
        travelDate
    } = req.body;

    const sql = `
    INSERT INTO bookings
    (name, phone, pickup, destination, vehicle, travel_date, \`package\`)
    VALUES (?, ?, ?, ?, ?, ?, ?)
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
            packageName
        ],
        (err, result) => {

            if(err){
                console.log("MYSQL ERROR:", err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Vehicle booking submitted successfully!"
            });

        }
    );

});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
    "SELECT * FROM register WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {

        console.log(result);


        if(result.length > 0){

            return res.json({
                success:true,
                message:"Login Successful",
                fullname: result[0].fullname
            });

        }else{

            return res.json({
                success:false,
                message:"Invalid Email or Password"
            });

        }

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

app.listen(5000, () => {
    console.log("Server running on port 5000");
});