const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const methodOverride = require('method-override'); //Allows to use delete and update verbs
const mongoose = require('mongoose');
//Init
const app = express()
//Routers
const landingRouter = require('./routes/landing')
const eventsRouter = require('./routes/events');
mongoose.connect('mongodb://127.0.0.1:27017/gestion-de-anteproyectos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const adminRouter = require('./routes/admin')


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
//http Request
app.use(express.urlencoded({extended:true})) //
app.use(methodOverride('_method')); //allows to make update and deletes methods
//Routes
app.use('/admin',adminRouter)
app.use('/events', eventsRouter);
app.use('/',landingRouter)


//Boot server
const port = app.get('port')
app.listen(port,()=>{
    console.log(`Server up and running on port ${port}`)
})