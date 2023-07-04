const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routesUrls = require('./routes/routes')
const cors = require('cors')
const bodyParser = require('body-parser')

dotenv.config() 

mongoose.connect(process.env.DATABASE_ACCESS)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const corsOptions = {
    origin: ['https://name-of-your.app', 'http://localhost:3000'],
    credentials: true,
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())
app.use(cors(corsOptions))
app.use('/', routesUrls)
app.listen(PORT, () => console.log(`server is running on ${PORT}`))