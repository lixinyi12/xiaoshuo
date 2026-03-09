const express = require("express")
const app = express();
const routes = require('./routes/index')
const cors = require('cors')
const cookieParser = require('cookie-parser');

//跨域
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true                  // 允许携带凭证
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('public/uploads'));
app.use(cookieParser());

app.use('/api', routes)
app.listen(3300, () => {
    console.log("服务器运行")
})