const renderLanding =  (req,res)=>{
    res.render('home',  { layout: false })
}



module.exports = {
    renderLanding
}