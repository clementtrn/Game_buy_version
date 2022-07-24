const libs = require("./libs")


module.exports=function(app){
    app.post('/contents',libs.getContents)

    app.post('/login',libs.login)

    app.post('/configuration',libs.getConfiguration)
    app.post('/playstate',libs.getPlayState)
    app.post('/nouveauTour',libs.nouveauTour)


    app.post('/saveBudgetsPompInit',libs.saveBudgetsPompInit)
    app.post('/saveBudgetsPompFin',libs.saveBudgetsPompFin)
    app.post('/getBudgetsPompInit',libs.getBudgetsPompInit)
    app.post('/getBudgetsPompFin',libs.getBudgetsPompFin)
    app.post('/updateChrono',libs.updateChrono)
    app.post('/startStopPartie',libs.startStopPartie)
    app.post('/updateConfig',libs.updateConfig)
    app.post('/getNbEquipes',libs.getNbEquipes)
    app.post('/getUsers',libs.getUsers)
    app.post('/createUsers',libs.createUsers)
    app.post('/resetPartie',libs.resetPartie)
    app.post('/getGeneralStats',libs.getGeneralStats)
}



