import express from "express";
const app = express();
let cors = require('cors');

app.use(cors());

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))

const PORT = 3000; 

// define a route handler for the default home page
app.use('/api', require('./routes/api.js'));

// start the Express server
app.listen(PORT, () => {
    console.log(`${PORT}`);
});