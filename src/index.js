const express = require('express')
const mongoose = require('mongoose')

const route = require("./routes/route")

const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://new_user:jk1BBWwmxQpZ31zO@cluster0.pxvwsjp.mongodb.net/MyProject3",

    { useNewUrlParser: true })

    .then(() => console.log("MDB is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen((3000), () => console.log("Server is running on port 3000!"))