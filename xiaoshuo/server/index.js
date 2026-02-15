const express = require("express")
const app = express();
const routes = require('./routes/index')
const cors = require('cors')

//跨域
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api',routes)
app.listen(3300,()=>{
    console.log("服务器运行")
})