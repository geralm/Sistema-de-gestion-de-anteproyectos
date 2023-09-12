const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
//Init
const app = express()
//Routers
const eventsRouter = require('./routes/events');

//Settings
app.use(express.static(path.join(__dirname, 'public')))
app.set('port',process.env.PORT || 4000)
app.set('views',path.join(__dirname, '/views'))


app.engine('hbs', hbs.create({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs'
}).engine);

//Register partials

app.set('view engine','.hbs')
app.use(express.urlencoded({extended:false}))

//Routes
app.use(require('./routes/admin'))
app.use('/events', eventsRouter);
app.get('/',(req,res)=>{
    res.send("Landing Page")
})


//Boot server
const port = app.get('port')
app.listen(port,()=>{
    console.log(`Server up and running on port ${port}`)
})