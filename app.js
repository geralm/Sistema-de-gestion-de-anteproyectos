const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const methodOverride = require('method-override'); //Allows to use delete and update verbs
const mongoose = require('mongoose');
const session = require("express-session")
const passport = require("passport")
const flash = require('connect-flash');
const handlebars = require('handlebars')
require('./config/passport')
//Init
const app = express()




//Routers
const landingRouter = require('./routes/landing')
const eventsRouter = require('./routes/events');
const adminRouter = require('./routes/admin')
const studentRouter = require('./routes/student')
const userRouter = require('./routes/user')

//Database
mongoose.connect('mongodb://127.0.0.1:27017/gestion-de-anteproyectos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



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

app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
  }); 

//Register partials

app.set('view engine','.hbs')
//http Request
app.use(express.urlencoded({extended:true})) //
app.use(methodOverride('_method')); //allows to make update and deletes methods
//Routes
app.use('/admin',adminRouter)
app.use('/events', eventsRouter);
app.use('/',landingRouter)
app.use('/student',studentRouter)
app.use('/user',userRouter)


//Boot server
const port = app.get('port')
app.listen(port,()=>{
    console.log(`Server up and running on port ${port}`)
})

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    console.log(arg1,arg2)
    if (arg1 === arg2) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
})