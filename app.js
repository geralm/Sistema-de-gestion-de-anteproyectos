const express = require('express')

//Init
const app = express()
app.set('port',process.env.PORT || 4000)


//Routes
app.use(require('./routes/admin'))

app.get('/',(req,res)=>{
    res.send("Landing Page")
})

//Boot server
const port = app.get('port')
app.listen(port,()=>{
    console.log(`Server up and running on port ${port}`)
})