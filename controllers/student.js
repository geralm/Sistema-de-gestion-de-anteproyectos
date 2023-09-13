

const renderStudentWelcome =  (req,res)=>{
    res.render('student/studentWelcome')
}

const renderStudentUpload =  (req,res)=>{
    res.render('student/studentUpload')
}

module.exports = {
    renderStudentWelcome,renderStudentUpload
}