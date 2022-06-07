const express = require("express");
const app = express();
app.set('view engine', 'ejs');
app.use('/static', express.static('public'))
app.use('/static', express.static('scripts'))

app.set("view engine", "ejs");

app.get('/',(req, res) => {
    res.sendFile(__dirname + "/index.html")
    });

    app.listen(8000);