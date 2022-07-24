const mysql = require('mysql')
const connData = {
    host: "91.234.195.113",
    user: "cp1723949p06_api",
    password: "APIpomp120897!",
    database: "cp1723949p06_pompiers",
    charset: "utf8"
}


let connection

async function initializeConn() {
    console.log("Initialize connection")

    function handleDisconnect() {
        connection = mysql.createConnection(connData)

        connection.connect(function (err) {
            if (err) {                                     // or restarting (takes a while sometimes).
                console.log('error when connecting to db:', err);
                setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
            }

        });


        connection.on('error', function (err) {
            console.log('db error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                handleDisconnect();                         // lost due to either server restart, or a
            } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
                handleDisconnect();

            } else {                                      // connnection idle timeout (the wait_timeout
                throw err;                                  // server variable configures this)
            }
        });
    }
    handleDisconnect();
}

async function insert(res, table, values) {


    const sql = "INSERT INTO " + table + " VALUES " + values

    if (connection == null) {
        await initializeConn()
    }

    const response = await connection.query(sql, function (err, result, fields) {
        if (err) {
            throw err
        };
        // console.log(result)
        // return res.status(200).json({})


    })

    return response
}

async function select(res, table, cond) {
    let sql
    if (cond.length != null) {
        sql = "SELECT * FROM " + table + " WHERE " + cond
    } else {
        sql = "SELECT * FROM " + table
    }
    // console.log(sql)
    if (connection == null) {
        await initializeConn()
    }
    var resp = {}
    const response = await connection.query(sql, function (err, result, fields) {
        if (err) {
            throw err
        };

        if (result.length > 1) {
            // console.log("results 1")
            result.forEach(element => {
                if (element.nom == null) {
                    resp[element.id] = element
                } else {
                    resp[element.nom] = element
                }
            });
            if (res !== null) {
                return res.status(200).json(resp)
            }
            else {
                return resp
            }


        } else {
            // console.log(result)
            if (result[0] != null) {
                if (res !== null) {

                    return res.status(200).json(result[0])
                } else {
                    // console.log("results 3")
                    return result[0]
                }
            } else {
                if (res !== null) {
                    return res.status(200).json({})
                } else {
                    // console.log("results 4")
                    return {}
                }
            }

        }

    })

    return resp
}
async function update(res, table, cond, set) {
    if (cond.length != null) {
        const sql = "UPDATE " + table + " SET " + set + " WHERE " + cond
        if (connection == null) {
            await initializeConn()
        }

        const response = await connection.query(sql, function (err, result, fields) {
            if (err) {

                throw err

            };
        })

        if (res !== null) {
            return res.status(200)
        } else {
            return true
        }
    }

    return null
}

async function getContents(req, res) {
    const nomView = req.body.nomView
    let response
    if (nomView.length > 0) {
        response = await select(res, "contenus", "nomVue = '" + nomView + "'")
    } else {
        response = await select("contenus", null)
    }
    console.log("get contents")
    return response
}

async function updateConfig(req, res) {
    const session = req.body.session
    const manualConfig = req.body.manualConfig
    // console.log(manualConfig)

    Object.keys(manualConfig).forEach((elt) => {
        const cond = "session = '" + session + "' AND nom='" + elt + "'"
        const set = "valeur = '" + JSON.stringify(manualConfig[elt].valeur) + "'"
        update(res, "parametres", cond, set)
    })
    console.log("config updated")
    return res.status(200).json(manualConfig)
}

async function nouveauTour(req, res) {
    const session = req.body.session
    const equipe = req.body.equipe

    Object.keys(req.body).forEach((elt) => {
        const cond = "equipe = '" + equipe + "' AND session = '" + session + "' AND nom='" + elt + "'"
        const set = "valeur = '" + JSON.stringify(req.body[elt]) + "'"
        update(res, "etatsession", cond, set)
    })
    console.log("nouveau tour")
    return res.status(200).json({ currentPomp: req.body.currentPomp })
}

async function login(req, res) {
    const identifiant = req.body.identifiant
    const mdp = req.body.mdp
    let response
    response = await select(res, "utilisateurs", "identifiant = '" + identifiant + "' AND mdp='" + mdp + "'")

    console.log("login")
    return response
}

async function getConfiguration(req, res) {
    const session = req.body.session
    const resp = await select(res, "parametres", "session = '" + session + "'")
    console.log("get parametres")
    return resp
}

async function getPlayState(req, res) {
    const session = req.body.session
    const equipe = req.body.equipe
    const resp = await select(res, "etatsession", "session = '" + session + "' AND (equipe='" + equipe + "' OR equipe IS NULL)")
    console.log("get play state")
    // console.log(response)
    return resp
}



async function saveBudgetsPompInit(req, res) {
    const session = req.body.session
    const equipe = req.body.equipe


    const cond = "equipe = '" + equipe + "' AND session = '" + session + "' AND nom='budgetsPompInit'"
    const set = "valeur = '" + JSON.stringify(req.body.cycles) + "'"
    update(res, "etatsession", cond, set)

    console.log("update budgets init")
    return res.status(200).json({ budgets: req.body.cycles })
}

async function saveBudgetsPompFin(req, res) {
    const session = req.body.session
    const equipe = req.body.equipe


    const cond = "equipe = '" + equipe + "' AND session = '" + session + "' AND nom='budgetsPompFin'"
    const set = "valeur = '" + JSON.stringify(req.body.budgetsFin) + "'"
    const rep = await update(res, "etatsession", cond, set)

    console.log("update budgets fin")
    return res.status(200).json({ budgets: req.body.budgetsFin })
}

async function getBudgetsPompInit(req, res) {
    const session = req.body.session
    const equipe = req.body.equipe
    const response = await select(res, "etatsession", "session = '" + session + "' AND equipe='" + equipe + "' AND nom='budgetsPompInit'")
    console.log("get budgets init")
    return response
}


async function getBudgetsPompFin(req, res) {
    const session = req.body.session
    const equipe = req.body.equipe
    const resp = await select(res, "etatsession", "session = '" + session + "' AND equipe='" + equipe + "' AND nom='budgetsPompFin'")
    // console.log(resp)
    console.log("get budgets fin")
    return resp
}

async function updateChrono(req, res) {
    const session = req.body.session
    const equipe = req.body.equipe
    const chrono = req.body.chrono


    const cond = "equipe = '" + equipe + "' AND session = '" + session + "' AND nom='currrentChrono'"
    const set = "valeur = '" + JSON.stringify(chrono) + "'"
    update(res, "etatsession", cond, set)

    return res.status(200).json({ chono: chrono })
}
async function startStopPartie(req, res) {
    const session = req.body.session
    const start = req.body.start


    const cond = "session = '" + session + "' AND nom='play'"
    const set = "valeur = '" + start + "'"
    update(res, "etatsession", cond, set)

    return res.status(200).json(JSON.stringify({ start: start }))
}


async function getNbEquipes(req, res) {
    const session = req.body.session

    const sql = "SELECT COUNT(*)  FROM (SELECT DISTINCT equipe FROM  utilisateurs WHERE session='" + session + "' AND equipe IS NOT NULL) AS ttt"
    if (connection == null) {
        await initializeConn()
    }

    var count = 0

    const response = connection.query(sql, function (err, result, fields) {
        if (err) {
            throw err
        };


        if (result[0] != null) {
            // console.log (Object.values(result[0])[0])
            count = (Object.values(result[0])[0])
            return res.status(200).json({ count: count })
        } else {
            return res.status(200).json({})
        }
    })

    // console.log(count)

    // return res.status(200).json({count:count})
}

async function getUsers(req, res) {
    const session = req.body.session

    const sql = "SELECT DISTINCT identifiant,mdp,equipe,role,session FROM  utilisateurs WHERE session='" + session + "' AND equipe IS NOT NULL AND NOT identifiant='admin' ORDER BY equipe,identifiant"
    if (connection == null) {
        await initializeConn()
    }


    const response = connection.query(sql, function (err, result, fields) {
        if (err) {
            throw err
        };

        // console.log(result)

        if (result.length != 0) {
            // console.log (Object.values(result))

            return res.status(200).json(Object.values(result))
        } else {
            return res.status(200).json([])
        }
    })
}

async function createUsers(req, res) {
    const session = req.body.session
    const nbEquipes = req.body.nbEquipes
    const users = req.body.users

    if (connection == null) {
        await initializeConn()
    }

    const get_random_password = (identifiant, length) => {

        return Math.random().toString(36).slice(-length);
        // return identifiant
    }


    const checkUserInList = (identifiant, equipe) => {
        var inList = false
        users.forEach(u => {
            // console.log(u)
            // console.log(identifiant,equipe,session)
            if (u.identifiant == identifiant && u.session == session && u.equipe == equipe) {
                inList = true
                // console.log(true)
            }
        })
        console.log(identifiant, inList)
        return inList
    }



    const addUser = async (identifiant, equipe) => {
        console.log("addUser")
        if (identifiant !== "admin" && equipe !== null) {

            if (identifiant.split("_").length <= 1) { //INTER
                // console.log("inter")

                if (checkUserInList(identifiant, equipe)) {
                    console.log("update inter")
                    const cond = "equipe = '" + equipe + "' AND session = '" + session + "' AND identifiant='" + identifiant + "'"
                    const set = "mdp = '" + get_random_password(identifiant, 6) + "', role = '" + identifiant.toUpperCase() + "'"
                    update(null, "utilisateurs", cond, set)
                } else {
                    console.log("insert inter")
                    insert(null, "utilisateurs", "(NULL,'" + identifiant + "', '" + get_random_password(identifiant, 6) + "','" + session + "','" + equipe + "','" + identifiant.toUpperCase() + "', null)")
                }

            } else {
                console.log("tact")
                const role = identifiant.split("_")[0].toUpperCase() + identifiant.split("_")[1][1]
                console.log(role)

                if (checkUserInList(identifiant, equipe)) {

                    const cond = "equipe = '" + equipe + "' AND session = '" + session + "' AND identifiant='" + identifiant + "'"
                    const set = "mdp = '" + get_random_password(identifiant, 6) + "', role = '" + role.toUpperCase() + "', equipe='" + equipe + "'"
                    update(null, "utilisateurs", cond, set)
                } else {
                    console.log("insert tact")
                    insert(null, "utilisateurs", "(NULL,'" + identifiant + "', '" + get_random_password(identifiant, 6) + "','" + session + "','" + equipe + "','" + role.toUpperCase() + "', null)")
                }
            }

        } else {
            console.log(identifiant)
        }

    }

    const addUsers = async () => {
        console.log("add users")
        for (let eq = 1; eq <= nbEquipes; eq++) {
            addUser("inter" + eq, eq)
            for (let i = 1; i < 7; i++) {
                addUser("tact_" + eq + "" + i, eq)
            }
        }
        return true
    }

    return res.status(200).json({ status: addUsers() })

}

async function getGeneralStats(req, res) {
    console.log("general stats")
    const session = req.body.session

    const sql = "SELECT * FROM etatsession WHERE session = '" + session + "'"
    if (connection == null) {
        await initializeConn()
    }


    const response = connection.query(sql, function (err, result, fields) {
        if (err) {
            throw err
        };

        if (result.length != 0) {
            return res.status(200).json(result)
        } else {
            return res.status(200).json([])
        }
    })

    // return res.status(200).json({test :"hey"})
    // 
}

async function resetPartie(req, res) {
    const nbEquipes = req.body.nbEquipes
    const session = req.body.session
    const etats = req.body.etats
    const chronoInit = req.body.chronoInit

    const checkEtatInList = (nom, equipe) => {
        var inList = false
        if (equipe !== null) {
            etats.forEach(e => {
                // console.log(e)
                // console.log(nom,session,equipe)
                if (e.nom == nom && e.session == session && e.equipe == equipe) {
                    inList = true
                }
            })
        } else {
            return true
        }
        console.log(nom, inList)
        return inList
    }

    const addEtat = async (nom, equipe, value) => {
        // console.log("addEtat")



        if (checkEtatInList(nom, equipe)) {
            // console.log("update etat")
            if (equipe === null) {
                const cond = "session = '" + session + "' AND nom='play'"
                const set = "valeur = 'false'"
                update(null, "etatsession", cond, set)
                // console.log("update "+nom)
            } else {
                const cond = "equipe = '" + equipe + "' AND session = '" + session + "' AND nom='" + nom + "'"
                const set = "valeur = '" + value + "'"
                update(null, "etatsession", cond, set)
                // console.log("update "+nom)
            }

        } else {
            // console.log("insert "+nom)
            insert(null, "etatsession", "(NULL,'" + session + "', '" + equipe + "','" + nom + "','" + value + "')")
        }



    }

    const addEtats = async () => {

        const defaultValues = {
            carte: JSON.stringify([[0, 4, 0, 0, 0, 0, 0, 1203, 0, 0, 0, 0, 0, 1303, 0, 4], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0], [1102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4], [0, 0, 0, 0, 4, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 21, 21, 0, 0, 21, 0, 0, 0], [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 4], [0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1501], [20, 0, 0, 0, 0, 0, 1601, 4, 0, 0, 20, 4, 0, 0, 0, 1404]]),
            mursH: JSON.stringify([[1, 1, 1, 1, 1, 1, 2, 5, 1, 1, 1, 1, 2, 6, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 2, 6, 1, 6, 2, 1, 1, 1, 6, 2, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 6, 2, 1, 1, 1, 1, 1, 1, 1, 1]]),
            mursV: JSON.stringify([[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], [2, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], [6, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 2], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 5]]),
            currentCycle: 1,
            currentTour: 1,
            currentSequence: 1,
            currentPomp: 0,
            resultatsDecedes: 0,
            resultatsSauves: 0,
            budgetsPompInit: JSON.stringify({ interventions: [], equipements: [] }),
            budgetsPompFin: JSON.stringify({ interventions: [], equipements: [] }),
            // play: false,
            currrentChrono: chronoInit


        }


        for (let eq = 1; eq <= nbEquipes; eq++) {
            Object.keys(defaultValues).forEach((key) => {
                addEtat(key, eq, defaultValues[key])
            })

        }


        return true
    }
    console.log("RELANCE PARTIE")
    console.log(addEtats())
    return res.status(200).json(true)
}


exports.getContents = getContents
exports.nouveauTour = nouveauTour
exports.getConfiguration = getConfiguration
exports.getPlayState = getPlayState
exports.login = login
exports.saveBudgetsPompInit = saveBudgetsPompInit
exports.saveBudgetsPompFin = saveBudgetsPompFin
exports.getBudgetsPompInit = getBudgetsPompInit
exports.getBudgetsPompFin = getBudgetsPompFin
exports.updateChrono = updateChrono
exports.startStopPartie = startStopPartie
exports.updateConfig = updateConfig
exports.getNbEquipes = getNbEquipes
exports.getUsers = getUsers
exports.createUsers = createUsers
exports.resetPartie = resetPartie
exports.getGeneralStats = getGeneralStats