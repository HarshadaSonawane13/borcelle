import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "information",
});

conn.connect((err) => {
  if (err) console.log("Error connecting to database: " + err.stack);
  else console.log("Connected successfully!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/signup", (req, res) => {
  let name = req.body.fullname;
  let email = req.body.email;
  let pass = req.body.pass;

  let query = "insert into user (name, email, password) values (?, ?, ?)";
  conn.query(query, [name, email, pass], (err, results) => {
    if (err) {
      console.log(err);
      res.send("<h1>Error inserting data</h1>");
    } else {
      res.send("User registered successfully.");
    }
  });
});

app.post('/login', (req, res) => {
    let email = req.body.email;
    let pass = req.body.password;

    let query = "select * from user where email = ? and password = ?";
    conn.query(query, [email, pass], (err, results) => {
        if (err) {
            res.send("<h1>Error retrieving data from database</h1>");
        }
        else if (results.length > 0) {
            res.redirect('/main');
        }
        else {
            res.send("<h1>Invalid email or password!</h1>")
        }
    })
})

app.get('/main', (req, res) => {
    res.send("<h1>Welcome. Congrats!</h1>");
});

app.listen(port, () => {
  console.log(`Server's running on port ${port}`);
});
