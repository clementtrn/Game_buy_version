import "../styles/App.css"
import React, { useState, useEffect, useRef } from 'react'
import PlayAPI from "../API/PlayAPI"
import TactBandeauTop from "../components/interfaceJoueur/TactBandeauTop"
import TactBandeauBottom from "../components/interfaceJoueur/TactBandeauBottom"
import Grille from "../components/interfaceJoueur/Grille"
import { useHistory } from 'react-router-dom';


import cookie from 'react-cookies'
import TactBandeauDroite from "../components/interfaceJoueur/TactBandeauDroite"
import { Typography } from "@material-ui/core"
import ContentsAPI from "../API/ContentsAPI"
import io from 'socket.io-client'


const TactInterface = () => {

  const history = useHistory()
  const user = cookie.load("user")

  const [socket, setSocket] = useState(null)


  
  const handleDisconnect = () => {
    if(socket!==null){
      socket.disconnect()
      
    }
    cookie.save('user', "disconnected", {
      path: '/',
      maxAge: 60 * 60 * 1.5, //sec
    })
    history.push('/login');
  }

  if (user === null || user === undefined || user == "disconnected") history.push("/login");
  if (user !== null && user !== undefined && user.role !== undefined && !user.role.includes("TACT")) handleDisconnect()
  const [play, setPlay] = useState(false)



  const [numPompier, setNumPompier] = useState(user !== null && user !== undefined && user.role !== undefined ? user.role.replace("TACT", "") : null)
  const [currentPomp, setCurrentPomp] = useState(null)
  const [currentTour, setCurrentTour] = useState(null)
  const [currentCycle, setCurrentCycle] = useState(null)
  const [currentSequence, setCurrentSequence] = useState(null)
  const [session, setSession] = useState(user != null ? user.session : null)
  const [equipe, setEquipe] = useState(user != null ? user.equipe : null)
  const [position, setPosition] = useState(null)
  const [deplacementEnCours, setDeplacementEnCours] = useState({
    type: 0,
    rotation: 1
  })
  const [histActions, setHistActions] = useState([])
  const [chrono, setChrono] = useState(null)
  useEffect(() => {
    if (numPompier == null) handleDisconnect()
  }, [numPompier])




  const [configuration, setConfiguration] = useState(null)

  const [stocks, setStocks] = useState(null)

  const [resultats, setResultats] = useState({
    Decedes: 0,
    Sauves: 0
  })

  const [interventions, setInterventions] = useState({
    Deplacement: 0,
    Feu: 0,
    FeuFum: 0,
    Fum: 0,
    Marqueur: 0,
    Porte: 0,
    Habitant: 0
  })

  const [budget, setBudget] = useState(0)
  const [budgetDepense, setBudgetDepense] = useState(0)


  const isLoading = useRef(false)

  // INITIALISATION DE LA CARTE

  // const [carte, setCarte] = useState([
  //   [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  //   [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  //   [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  //   [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  //   [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  //   [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  //   [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  //   [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  // ])

  const [carte, setCarte] = useState([])

  const [nbLignesGrille, setNbLignesGrille] = useState(0)
  const [nbColonnesGrille, setNbColonnesGrille] = useState(0)

  const [mursH, setMursH] = useState([
    [1, 1, 1, 1, 1, 1, 2, 6, 1, 1, 1, 1, 2, 5, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 2, 6, 1, 6, 2, 1, 1, 1, 5, 2, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 6, 2, 1, 1, 1, 1, 1, 1, 1, 1]
  ])

  const [mursV, setMursV] = useState([
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [2, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [5, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 2],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 5]
  ])



  // GET PLAY PARAMETERS 
  const getPlayState = async (session, equipe) => {
    // console.log("get play state")
    if (!isLoading.current) {
      isLoading.current = true
      const currentPlayState = await PlayAPI.getPlayState(session, equipe)
      // console.log(currentPlayState)
      if (Object.keys(currentPlayState).length > 0) {
        // console.log(parseInt(JSON.parse(currentPlayState.currentTour.valeur)))

        setCurrentPomp(parseInt(JSON.parse(currentPlayState.currentPomp.valeur)))
        setCurrentTour(parseInt(JSON.parse(currentPlayState.currentTour.valeur)))
        setCurrentCycle(parseInt(JSON.parse(currentPlayState.currentCycle.valeur)))
        setCurrentSequence(parseInt(JSON.parse(currentPlayState.currentSequence.valeur)))

        setMursH(JSON.parse(currentPlayState.mursH.valeur))
        setMursV(JSON.parse(currentPlayState.mursV.valeur))
        setCarte(JSON.parse(currentPlayState.carte.valeur))
        setResultats({
          Decedes: parseInt(JSON.parse(currentPlayState.resultatsDecedes.valeur)),
          Sauves: parseInt(JSON.parse(currentPlayState.resultatsSauves.valeur)),
        })
        setPlay(JSON.parse(currentPlayState.play.valeur))
        // if(parseInt(JSON.parse(currentPlayState.currentPomp.valeur))==1 && parseInt(JSON.parse(currentPlayState.currentTour.valeur))==1){
        getBudget(parseInt(JSON.parse(currentPlayState.currentCycle.valeur)), parseInt(JSON.parse(currentPlayState.currentSequence.valeur)))
        //  }
        const c = parseInt(JSON.parse(currentPlayState.currrentChrono.valeur))
        if (configuration !== null && c <= configuration.chronoTourTact.valeur && parseInt(JSON.parse(currentPlayState.currentPomp.valeur)) == numPompier) {
          if(c==0){
            setChrono(configuration.chronoTourTact.valeur)
          }else{
            setChrono(c)
          }
          
          // console.log(c)
        } else {
          setChrono(null)
          // console.log(c,configuration.chronoTourTact.valeur)
        }
      }
      getPositionFromCarte(JSON.parse(currentPlayState.carte.valeur))
      isLoading.current = false
    }

  }


  useEffect(() => {
    // console.log(carte)
    if (carte.length > 0) {
      setNbLignesGrille(carte.length)
      setNbColonnesGrille(carte[0].length)
      getPositionFromCarte(carte)
    }

  }, [carte])

  // useEffect(()=>{
  //   console.log(currentTour)
  // },[currentTour])


  useEffect(() => {
    if (session != null && equipe != null && currentTour == null) {
      if (!isLoading.current && configuration !== null) getPlayState(session, equipe)
      getPlayParameters()
      getPositionFromCarte(carte)
    }
  }, [session, equipe, numPompier, configuration])

  const getPlayParameters = async () => {
    const param = await PlayAPI.getConfiguration(session)
    setConfiguration(param)
  }

  const getPositionFromCarte = (carte) => {
    if (carte != null && carte.length > 0) {
      carte.forEach((ligne, indexI) => {
        ligne.forEach((valeur, indexJ) => {

          if (Math.floor(valeur / 1000) == 1 && Math.floor(valeur % 1000 / 100) == numPompier) {
            setPosition([indexI, indexJ])
            setDeplacementEnCours({
              type: 0,
              rotation: valeur % 10
            })
          }

        })
      });
    }
  }
 





  // const onTextChange = (e) => {
  //   setNumPompier(e.target.value)
  //   console.log(typeof (e.target.value))
  // }

  // const onXChange = (e) => {
  //   e.preventDefault()
  //   if (e.target.value.length > 0) {
  //     updateCarte(position, 0)
  //     setPosition(position => [position[0], parseInt(e.target.value)])
  //   } else {
  //     updateCarte(position, 0)
  //     setPosition(position => [position[0], 0])
  //   }

  // }
  // const onYChange = (e) => {
  //   e.preventDefault()
  //   if (e.target.value.length > 0) {
  //     updateCarte(position, 0)
  //     setPosition(position => [parseInt(e.target.value), position[1]])
  //   } else {
  //     updateCarte(position, 0)
  //     setPosition(position => [0, position[1]])
  //   }
  // }


  // UPDATES
  const updateCarte = (coords, value) => {
    if (coords[0] < nbLignesGrille && coords[1] < nbColonnesGrille) {
      try {
        var c = [...carte]
        c[coords[0]][coords[1]] = value
        setCarte(c)
      } catch (error) {
        // console.log(error)
      }
    }


  }
  const updateMurH = (coords, value) => {
    if (coords[0] < mursH.length && coords[1] < mursH[0].length) {
      try {
        var m = [...mursH]
        m[coords[0]][coords[1]] = value
        setMursH(m)

      } catch (error) {
        // console.log(error)
      }
    }
  }
  const updateMurV = (coords, value) => {
    if (coords[0] < mursV.length && coords[1] < mursV[0].length) {
      try {
        var m = [...mursV]
        m[coords[0]][coords[1]] = value
        setMursV(m)
      } catch (error) {
        // console.log(error)
      }
    }
  }


  // ACTIONS

  const updateBudget = (action) => {
    var depenses = 0
    if (configuration["coutEq" + action] != null) depenses += configuration["coutEq" + action].valeur
    if (configuration["coutInter" + action] != null) depenses += configuration["coutInter" + action].valeur

    setBudget(budget => budget - depenses)
    setBudgetDepense(bd => bd + depenses)
  }




  const addHistAction = (budget, budgetDepense) => {
    // console.log("add hist")
    const h = [...histActions, {
      carte: JSON.stringify(carte),
      budget: JSON.stringify(budget),
      budgetDepense: JSON.stringify(budgetDepense),
      mursH: JSON.stringify(mursH),
      mursV: JSON.stringify(mursV),
      stocks: JSON.stringify(stocks),
      resultats: JSON.stringify(resultats),
      interventions: JSON.stringify(interventions),
      deplacementEnCours: JSON.stringify({
        type: 0,
        rotation: deplacementEnCours.rotation
      })
    }]


    setHistActions(h)
  }

  

  const retourAction = () => {
    // isLoading.current = true
    var h = [...histActions]
    
    h.pop()
    const state = h[h.length - 1]
    // console.log(h)
    // console.log(state)
    // console.log(state.deplacementEnCours)

    setCarte(JSON.parse(state.carte))
    setMursH(JSON.parse(state.mursH))
    setMursV(JSON.parse(state.mursV))
    setStocks(JSON.parse(state.stocks))
    setInterventions(JSON.parse(state.interventions))
    setResultats(JSON.parse(state.resultats))
    setBudget(JSON.parse(state.budget))
    setBudgetDepense(JSON.parse(state.budgetDepense))

    setDeplacementEnCours(JSON.parse(state.deplacementEnCours))
    
    setHistActions(h)

    // isLoading.current = false
  }

  useEffect(() => {
    if (position !== null && stocks !== null && budget > 0 && deplacementEnCours.type == 0 && (histActions[histActions.length - 1] == undefined || budget < histActions[histActions.length - 1].budget)) {
      addHistAction(budget, budgetDepense)
    }
  }, [deplacementEnCours, budgetDepense, stocks])

  // useEffect(() => {
  //   console.log("hist Actions")
  //   console.log(histActions)
  // }, [histActions])

  // useEffect(()=>{
  //   if( position!==null && budget>0){

  //     if(histActions[histActions.length-1]!==undefined && budget<histActions[histActions.length-1].budget ){

  //       addHistAction(budget)
  //     }
  //   }
  // },[budget])

  const doAction = (action) => {
    // console.log(action)

    try {
      if (Object.keys(stocks).includes(action)) {
        var s = stocks
        s[action] = s[action] - 1
        setStocks(s)
      }

    } catch (error) { }

    try {
      if (Object.keys(interventions).includes(action)) {
        var i = interventions
        i[action] = i[action] - 1
        setInterventions(i)
      }
    } catch (error) { }

    // setTimeout(() => {
    updateBudget(action)
    // }, 1000);

  }

  const updateResultats = (sauve) => {
    var res = { ...resultats }
    if (sauve) {
      res.Sauves += 1
    } else {
      res.Decedes += 1
    }
    // console.log(res)
    setResultats(res)
  }





  useEffect(() => {
    setBtnClickedBottom(null)
    revealHabitant()
  }, [position])


  useEffect(() => {
    if (carte.length > 0) relacherHabitant()

  }, [position, mursH, mursV])




  // useEffect(() => {
  //   console.log("Stocks")
  //   console.log(stocks)
  // }, [stocks])



  useEffect(() => {
    if (configuration != null) {
      var inter = {...interventions}
      const interKeys = Object.keys(inter)
      // console.log(Math.floor(budget / configuration["coutInter" + "Habitant"].valeur))
      interKeys.forEach(action => {
        try {
          if (configuration["coutInter" + action].valeur > 0) {
            // if(action=="Habitant"){
            //   console.log(stocks !== null && stocks[action] != null && stocks[action] != undefined && stocks[action] != "NaN" ? stocks[action] : 1000)
            // }
            inter[action] = Math.min(
              configuration["coutEq" + action] != null && configuration["coutEq" + action] != undefined ? Math.floor(budget / (configuration["coutInter" + action].valeur + configuration["coutEq" + action].valeur)) : Math.floor(budget / configuration["coutInter" + action].valeur),
              stocks !== null && stocks[action] != null && stocks[action] != undefined && stocks[action] != "NaN" ? stocks[action] : 1000
            )
          }
        } catch (error) {
          // console.log(error, action)
        }

      })
      // console.log(inter)
      setInterventions(inter)

    } else {
      // getPlayParameters()
    }
  }, [budget, configuration, numPompier, stocks])

  // SOCKETS

  // SOCKETS 
  const onTourChange = async (e) => {
    e.preventDefault()
    // console.log("nouveau tour todo")
  }

  const modifyBudgetsFin = async (cycle, sequence,prochainPomp,prochainTour,prochainCycle,prochaineSequence,prochainChrono) => {
    // console.log("budgets modified 0")
    PlayAPI.getBudgetsPompFin(session, equipe).then(
      (res) => {
        // console.log(res)
        var budgetsFin = JSON.parse(res.valeur)

        try {
          budgetsFin.interventions.forEach((b, index) => {
            if (b.numCycle == cycle && b.numSeq == sequence) {

              budgetsFin["interventions"][index]["pomp" + numPompier] = budget
            }

          })
        } catch (error) {

        }

        try {
          budgetsFin.equipements.forEach((e, index) => {
            if (e.numCycle == cycle && e.numSeq == sequence) {
              budgetsFin["equipements"][index]["Feu"]["pomp" + numPompier] = stocks.Feu
              budgetsFin["equipements"][index]["FeuFum"]["pomp" + numPompier] = stocks.FeuFum
              budgetsFin["equipements"][index]["Fum"]["pomp" + numPompier] = stocks.Fum
              budgetsFin["equipements"][index]["Marqueur"]["pomp" + numPompier] = stocks.Marqueur
            }

          })
        } catch (error) {

        }
        // console.log("budgets modified 1")
        PlayAPI.saveBudgetsPompFin(budgetsFin, session, equipe).then(() => {
          const newCarte = evenementsAleatoire()
           PlayAPI.nouveauTour(socket, prochainPomp, newCarte, mursH, mursV, prochaineSequence, prochainCycle, prochainTour, resultats.Decedes, resultats.Sauves, session, equipe,prochainChrono )
          // return budgetsFin
        }


        )
      })

  }

  const getBudget = async (cycle, sequence) => {
    var nouveauBudget = await PlayAPI.getBudgetsPompFin(session, equipe)
    nouveauBudget = nouveauBudget.valeur
    // console.log(nouveauBudget)
    nouveauBudget = JSON.parse(nouveauBudget)

    let budgetInter = 0
    let stocksEq = stocks !== null && stocks !== undefined ? { ...stocks } : { Feu: 0, FeuFum: 0, Fum: 0, Marqueur: 0 }

    try {
      nouveauBudget.interventions.forEach((b) => {
        if (b.numCycle == cycle && b.numSeq == sequence) {

          budgetInter = b["pomp" + numPompier]
        }

      })
    } catch (error) {

    }

    try {
      nouveauBudget.equipements.forEach((e) => {
        if (e.numCycle == cycle && e.numSeq == sequence) {
          stocksEq.Feu += e.Feu["pomp" + numPompier]
          stocksEq.FeuFum += e.FeuFum["pomp" + numPompier]
          stocksEq.Fum += e.Fum["pomp" + numPompier]
          stocksEq.Marqueur += e.Marqueur["pomp" + numPompier]
        }

      })
    } catch (error) {

    }

    // console.log(nouveauBudget)
    if (budgetInter !== budget) {
      setBudget(budgetInter)
      setBudgetDepense(0)

    }
    setStocks(stocksEq)


  }

  
  // console.log(socket)
  useEffect(() => {
    if (socket === null && configuration !== null) {
      const s = io("https://www.back.leaders-extreme.fr")
      
      // console.log("test")
      s.emit("connecti",JSON.stringify({
        session:session,
        equipe:equipe
      }))

      s.on('changementTour', (data) => {
        // console.log("changement tour")
        const d =data
        console.log(d)
        if (currentPomp != d.currentPomp || currentCycle !== d.currentCycle || currentTour !== d.currentTour || currentSequence !== d.currentSequence) {
          console.log("changement tour")
          getPlayState(session, equipe)
        }
      })


      // s.on('revealHabitant', (data) => {
      //   if (carte !== null && carte.length > 0) {
      //     // console.log(carte[data.y][data.x])
      //     console.log(carte[data.y])
      //     if (carte[data.y][data.x] == 20) {
      //       // console.log([data.y,data.x])
      //       updateCarte([data.y, data.x], data.type)
      //       // console.log("socket hab")
      //       // console.log(data)
      //     }
      //   }
      // })

      s.on('startStopPartie', (data) => {
        setPlay(data.start)
      });
      s.on('disconnectUsers', (data) => {
        setPlay(false)
        handleDisconnect()
      });
      setSocket(s)
    }



  }, [socket, configuration]);



  // TESTS

  const test = async () => {

    // console.log("test function")

  }

// useEffect(()=>{
//   console.log(interventions,budget)
// },[interventions,budget])


  // AUTORISATIONS 
  const deplacementAutorise = (deplacement) => {
    // return true
    var dpl = [...deplacement]
    if (dpl[0] == 0 && dpl[1] == 0) return false
    if (position[0] + dpl[0] > carte.length - 1 || position[1] + dpl[1] > carte[0].length - 1 || position[0] + dpl[0] < 0 || position[1] + dpl[1] < 0) return false


    const dplInterditsCases = [1000, 20, 3, 4]

    try {
      const valeurCaseDeplacement = carte[position[0] + dpl[0]][position[1] + dpl[1]]
      if (Math.floor(valeurCaseDeplacement / 1000) == 1) return false
      if (Math.floor(valeurCaseDeplacement / 10) == 2) return false
      if (dplInterditsCases.includes(valeurCaseDeplacement)) return false
    } catch (error) { }

    const dplInterditsMurs = [1, 2, 3, 5]
    try {
      if (dpl[0] != 0) { // haut bas
        if (dpl[0] < 0) {
          dpl[0] = 0
        }
        if (typeof (mursH[position[0] + dpl[0]][position[1]]) === 'undefined') return false
        if (dplInterditsMurs.includes(mursH[position[0] + dpl[0]][position[1]])) return false
      } else { // gauche droite
        if (dpl[1] < 0) {
          dpl[1] = 0
        }
        if (typeof (mursV[position[0]][position[1] + dpl[1]]) === 'undefined') return false
        if (dplInterditsMurs.includes(mursV[position[0]][position[1] + dpl[1]])) return false
      }
    } catch (error) { }




    return true
  }
  const testRelacherHabitant = () => {
    if (carte[position[0]][position[1]] % 100 < 10) return false // pas de transport d'habitant

    const mursBloquants = [1, 2, 3, 5]

    if (position[0] == 0 && !mursBloquants.includes(mursH[position[0]][position[1]])) return true // haut
    if (position[0] == nbLignesGrille - 1 && !mursBloquants.includes(mursH[position[0] + 1][position[1]])) return true // bas

    if (position[1] == 0 && !mursBloquants.includes(mursV[position[0]][position[1]])) return true // gauche
    if (position[1] == nbColonnesGrille - 1 && !mursBloquants.includes(mursV[position[0]][position[1] + 1])) return true // droite

    return false
  }
  const relacherHabitant = () => {
    if (testRelacherHabitant()) {
      setTimeout(() => {
        updateResultats(true)
        updateCarte(position, carte[position[0]][position[1]] - (carte[position[0]][position[1]] % 100 - carte[position[0]][position[1]] % 10))
      }, 1000);
    }
  }

  const revealHabitant = async () => {

    if (configuration != null) {
      const casesAutour = getCasesAutour()

      try {
        if (casesAutour.dessus == 20) {
          updateCarte([position[0] - 1, position[1]], 0)
          resetHistAction()
          // const response = await PlayAPI.revealHabitant(socket, [position[0] - 1, position[1]], 0)
        }
      } catch (error) { }
      try {
        if (casesAutour.droite == 20) {
          updateCarte([position[0], position[1] + 1], 0)
          resetHistAction()
          // const response = await PlayAPI.revealHabitant(socket, [position[0], position[1] + 1], 0)

        }
      } catch (error) { }
      try {
        if (casesAutour.dessous == 20) {
          updateCarte([position[0] + 1, position[1]], 0)
          resetHistAction()
          // const response = await PlayAPI.revealHabitant(socket, [position[0] + 1, position[1]], 0)

        }
      } catch (error) { }
      try {
        if (casesAutour.gauche == 20) {
          updateCarte([position[0], position[1] - 1], 0)
          resetHistAction()
          // const response = await PlayAPI.revealHabitant(socket, [position[0], position[1] - 1], 0)

        }
      } catch (error) { }

    }

  }

  const getCasesAutour = () => {
    var cases = {}

    try {
      cases["dessus"] = (carte[position[0] - 1][position[1]]) // dessus
    } catch (error) { }
    try {
      cases["droite"] = (carte[position[0]][position[1] + 1]) // droite
    } catch (error) { }
    try {
      cases["dessous"] = (carte[position[0] + 1][position[1]]) // dessous
    } catch (error) { }
    try {
      cases["gauche"] = (carte[position[0]][position[1] - 1]) // gauche
    } catch (error) { }
    return cases
  }
  const getMursAutour = (position) => {
    var murs = []

    try {
      if (mursH[position[0]][position[1]] != 4 || (mursH[position[0]][position[1] - 1] < 6 && mursH[position[0]][position[1] + 1] < 6)) {
        murs.push(mursH[position[0]][position[1]]) // dessus
      } else {
        murs.push(0)
      }
    } catch (error) { }

    try {
      if (mursV[position[0]][position[1] + 1] != 4 || (mursV[position[0] - 1][position[1] + 1] < 6 && mursV[position[0] + 1][position[1] + 1] < 6)) {
        murs.push(mursV[position[0]][position[1] + 1])  // droite
      } else {
        murs.push(0)
      }
    } catch (error) { }

    try {
      if (mursH[position[0] + 1][position[1]] != 4 || (mursH[position[0] + 1][position[1] - 1] < 6 && mursH[position[0] + 1][position[1] + 1] < 6)) {
        murs.push(mursH[position[0] + 1][position[1]]) // dessous
      } else {
        murs.push(0)
      }

    } catch (error) { }
    try {
      if (mursV[position[0]][position[1]] != 4 || (mursV[position[0] - 1][position[1]] < 6 && mursV[position[0] + 1][position[1]] < 6)) {
        murs.push(mursV[position[0]][position[1]])  // gauche
      } else {
        murs.push(0)
      }
    } catch (error) { }
    // console.log(murs)
    return murs
  }

  // useEffect(()=>{
  //   console.log(histActions)
  // },[histActions])

  const resetHistAction = () => {
    // console.log("reset actions")
    setTimeout(() => {
      setHistActions([{
        carte: JSON.stringify(carte),
        budget: JSON.stringify(budget),
        budgetDepense: JSON.stringify(budgetDepense),
        mursH: JSON.stringify(mursH),
        mursV: JSON.stringify(mursV),
        stocks: JSON.stringify(stocks),
        resultats: JSON.stringify(resultats),
        interventions: JSON.stringify(interventions),
        deplacementEnCours: JSON.stringify({
          type: 0,
          rotation: deplacementEnCours.rotation
        })
      }])
    }, 300);
  }


  const [btnClickedBottom, setBtnClickedBottom] = useState(null)
  const [propositionsCase, setPropositionsCase] = useState([]) // Extincteurs
  const [propositionMursDetruire, setPropositionMursDetruire] = useState([[], []]) // Horizontaux  , Verticaux
  useEffect(() => {
    if (btnClickedBottom != 3 || btnClickedBottom == null) {
      setPropositionMursDetruire([[], []])
    }
    if ((btnClickedBottom > 2 && btnClickedBottom < 6) || btnClickedBottom == null) {
      setPropositionsCase([])
    }
  }, [btnClickedBottom])




  // HANDLERS CLIC GRILLE

  const handleClicCase = (valeurAvant, valeurApres, coordX, coordY) => {
    try {
      updateCarte([coordY, coordX], valeurApres)
      setPropositionsCase([])
      setBtnClickedBottom(null)

      if (valeurAvant == 4 && valeurApres == 0) { // Extincteur flamme
        doAction("Feu")
      }
      if (valeurAvant == 4 && valeurApres == 3) { // Feu Fumée
        doAction("FeuFum")
      }
      if (valeurAvant == 3 && valeurApres == 0) { // Fumée
        doAction("Fum")
      }
      if (Math.floor(valeurAvant / 10) == 2 && valeurApres == 0) { // Habitant
        doAction("Habitant")
        // console.log(carte[position[0]][position[1]] + (valeurAvant % 10)*10)
        updateCarte(position, carte[position[0]][position[1]] + (valeurAvant % 10)*10)
      }
    } catch (error) { }
  }

  const handleClicMur = (num, valeurAvant, coordX, coordY) => { // marqueur dégat
    if (propositionMursDetruire[0].length > 0 || propositionMursDetruire[1].length > 0) {

      const checkInCoords = (index) => {
        // console.log("coordx",coordX,"coordy",coordY,"position",position)

        let numClic = null

        if (coordX == position[1] && (coordY < position[0] || (coordY == position[0] && num == 0))) { // top
          numClic = 0  // case en question
          // console.log("top",numClic)
        }
        if (coordX == position[1] && (coordY > position[0] || (coordY == position[0] && num == 2))) { // bottom
          numClic = 2  // case en question
          // console.log("bottom",numClic)
        }
        if (coordY == position[0] && (coordX < position[1] || (coordX == position[1] && num == 3))) { // left
          numClic = 3  // case en question
          // console.log("left",numClic)
        }
        if (coordY == position[0] && (coordX > position[1] || (coordX == position[1] && num == 1))) { // right
          numClic = 1  // case en question
          // console.log("right",numClic)
        }

        return numClic
      }

      var cote = checkInCoords(num % 2)
      let valeurApres = 4
      if (valeurAvant == 1) valeurApres = 3

      if (cote != null) {
        try {
          switch (cote) {
            case 0:
              updateMurH([position[0], position[1]], valeurApres)
              // if(valeurAvant==5 ||)
              break;
            case 1:
              updateMurV([position[0], position[1] + 1], valeurApres)
              break;
            case 2:
              updateMurH([position[0] + 1, position[1]], valeurApres)
              break;
            case 3:
              updateMurV([position[0], position[1]], valeurApres)
              break;
          }

          doAction("Marqueur")


        } catch (error) {
        }



        setPropositionMursDetruire([[], []])
        setBtnClickedBottom(null)
      }

    }

  }



  // HANDLER CLICS BOUTONS

  const handleClicFleche = (num) => {
    // Position y x
    let deplacement
    let rotation
    switch (num) {
      case 0: // haut
        // console.log("haut")
        deplacement = [-1, 0]
        rotation = 1
        break;

      case 1: // droite
        // console.log("droite")
        deplacement = [0, 1]
        rotation = 2
        break;

      case 2: // bas
        // console.log("bas")
        deplacement = [1, 0]
        rotation = 3
        break;

      case 3: // gauche
        // console.log("gauche")
        deplacement = [0, -1]
        rotation = 4
        break;
    }
    if (deplacementAutorise(deplacement)) {

      // ANIMATION MARCHE

      setDeplacementEnCours({
        type: 1,
        rotation: rotation
      })
      setTimeout(() => {
        updateCarte([position[0] + deplacement[0], position[1] + deplacement[1]], carte[position[0]][position[1]] - carte[position[0]][position[1]] % 10 + rotation)
        // setPosition(position => [position[0] + deplacement[0], position[1] + deplacement[1]])
        if((carte[position[0]][position[1]]%100 - carte[position[0]][position[1]]%10)/10>0){
          doAction("DeplacementHab")
        }else{
          doAction("Deplacement")
        }
        
        updateCarte(position, 0)


        setDeplacementEnCours({
          type: 2,
          rotation: rotation
        })
        setTimeout(() => {
          setDeplacementEnCours({
            type: 0,
            rotation: rotation
          })
        }, 500);

      }, 500);


    }
  }

  const handleChangePiece = () => {
    resetHistAction()
  }

  const handleClicDoor = (ouvrir) => { // position, ouvert/fermé
    setBtnClickedBottom(ouvrir ? 4 : 5)
    let valueAvant
    let valueApres

    if (ouvrir) {
      valueAvant = 5
      valueApres = 6

    } else {
      valueAvant = 6
      valueApres = 5
    }
    doAction("Porte")
    try {
      if (mursH[position[0]][position[1]] == valueAvant) updateMurH([position[0], position[1]], valueApres)
      if (mursH[position[0] + 1][position[1]] == valueAvant) updateMurH([position[0] + 1, position[1]], valueApres)
      if (mursV[position[0]][position[1]] == valueAvant) updateMurV([position[0], position[1]], valueApres)
      if (mursV[position[0]][position[1] + 1] == valueAvant) updateMurV([position[0], position[1] + 1], valueApres)
    } catch (error) {

    }
  }

  const handleClicExtincteur = (num) => {
    // 0 FEU, 1 FEUFUM, 2 FUM
    const mursInterdits= [1,2,3,5]
    const mursAutour = getMursAutour(position)

    if (btnClickedBottom != num) {
      var listeCasesAction = []
      let valeurAvant = 4
      let valeurApres = 0
      setBtnClickedBottom(num)
      switch (num) {
        case 0: // ETEINDRE FEU
          break;

        case 1: // FEU FUM
          valeurApres = 3
          break;
        case 2: // ETEINDRE FUMEE
          valeurAvant = 3
          break;
      }

      try {
        if (carte[position[0] - 1][position[1]] == valeurAvant && !mursInterdits.includes(mursAutour[0])) {
          listeCasesAction.push([position[0] - 1, position[1], valeurAvant, valeurApres]) // TOP
        }
      } catch (error) { }
      try {
        if (carte[position[0]][position[1] + 1] == valeurAvant && !mursInterdits.includes(mursAutour[1])) {
          listeCasesAction.push([position[0], position[1] + 1, valeurAvant, valeurApres]) // RIGHT
        }
      } catch (error) { }
      try {
        if (carte[position[0] + 1][position[1]] == valeurAvant && !mursInterdits.includes(mursAutour[2] )){ 
          listeCasesAction.push([position[0] + 1, position[1], valeurAvant, valeurApres]) // BOTTOM
        }
      } catch (error) { }
      try {
        if (carte[position[0]][position[1] - 1] == valeurAvant && !mursInterdits.includes(mursAutour[3])) {
          listeCasesAction.push([position[0], position[1] - 1, valeurAvant, valeurApres]) // LEFT
          console.log("test")
        }
      } catch (error) { }

      setPropositionsCase(listeCasesAction)
    } else {
      setBtnClickedBottom(null)
    }

  }

  const handleClicMarqueur = () => {
    if (btnClickedBottom != 3) {
      setBtnClickedBottom(3)
      if (propositionMursDetruire[0].length > 0 || propositionMursDetruire[1].length > 0) {
        setPropositionMursDetruire([[], []])
      } else {
        const mursADetruire = [1, 3, 5, 6]
        var propositions = [
          [],
          []
        ]
        const mursAutour = getMursAutour(position)

        try {
          if (mursADetruire.includes(mursAutour[0])) propositions[0].push([position[1], position[0]]) // top
          if (mursADetruire.includes(mursAutour[1])) propositions[1].push([position[1] + 1, position[0]]) // right
          if (mursADetruire.includes(mursAutour[2])) propositions[0].push([position[1], position[0] + 1]) // bottom
          if (mursADetruire.includes(mursAutour[3])) propositions[1].push([position[1], position[0]]) // left

        } catch (error) {

        }
        setPropositionMursDetruire(propositions)

      }
    } else {
      setBtnClickedBottom(null)
    }


  }

  const handleClicValidated = async (bool) => {
    // console.log("handle Clic")
    if (configuration != null) {
      if (bool) {


        let prochainPomp = currentPomp + 1
        let prochainTour = currentTour
        let prochainCycle = currentCycle
        let prochaineSequence = currentSequence
        let prochainChrono = configuration.chronoTourTact.valeur


        if (numPompier == configuration.nbPompEquipe.valeur) { // DERNIER POMP DU TOUR
          if (currentTour == configuration.nbToursParCycle.valeur) { // SEND TO INTER
            prochainTour = 1
            prochainPomp = 0 // A CHANGER AVEC STRATEGIQUE

            prochainChrono = configuration.chronoTourInter.valeur

            if (prochainCycle == configuration.nbCyclesParSequence.valeur) {
              prochainCycle = 1
              prochaineSequence = prochaineSequence + 1
            } else {
              prochainCycle = prochainCycle + 1
            }



          } else { // PAS DERNIER TOUR DU CYCLE
            // console.log("pas dernier tour")
            prochainPomp = 1
            prochainTour = prochainTour + 1
            // prochainChrono = configuration.chronoTourTact.valeur

          }

        }

        // console.log(prochainPomp,prochainTour,prochainCycle)


        
        // console.log("budgets fin 1")
        const res = modifyBudgetsFin(currentCycle, currentSequence,prochainPomp,prochainTour,prochainCycle,prochaineSequence,prochainChrono)
        
        resetHistAction()

        // setChrono(null)
      } else {
        retourAction()
        // console.log("retour")
      }
    }

  }

  const handleNoClicked = () => {
    setPropositionMursDetruire([[], []])
    setPropositionsCase([])
  }

  const handleClicHabitant = () => {
    if (btnClickedBottom != 6) {
      setBtnClickedBottom(6)
      const valeurApres = 0
      var listeCasesAction = []
      try {
        const valeurDessus = carte[position[0] - 1][position[1]]
        if (Math.floor(valeurDessus / 10) == 2) listeCasesAction.push([position[0] - 1, position[1], valeurDessus, valeurApres]) // TOP
      } catch (error) { }
      try {
        const valeurDroite = carte[position[0]][position[1] + 1]
        if (Math.floor(valeurDroite / 10) == 2) listeCasesAction.push([position[0], position[1] + 1, valeurDroite, valeurApres]) // RIGHT
      } catch (error) { }
      try {
        const valeurDessous = carte[position[0] + 1][position[1]]
        if (Math.floor(valeurDessous / 10) == 2) listeCasesAction.push([position[0] + 1, position[1], valeurDessous, valeurApres]) // BOTTOM
      } catch (error) { }
      try {
        const valeurGauche = carte[position[0]][position[1] - 1]
        if (Math.floor(valeurGauche / 10) == 2) listeCasesAction.push([position[0], position[1] - 1, valeurGauche, valeurApres]) // LEFT
      } catch (error) { }

      setPropositionsCase(listeCasesAction)


      // console.log("handle clic habitant")
    } else {
      setBtnClickedBottom(null)
    }

  }




  const getRandomCoords = (mini, maxi) => {
    if (carte !== null && carte !== undefined && carte.length > 0) {
      var y = Math.floor(Math.random() * (maxi[0] - mini[0])) + mini[0]
      var x = Math.floor(Math.random() * (maxi[1] - mini[1])) + mini[1]

      var type = carte[y][x]
      while (Math.floor(type / 1000) == 1 || Math.floor(type / 10) == 2) {
        y = Math.floor(Math.random() * (maxi[0] - mini[0])) + mini[0]
        x = Math.floor(Math.random() * (maxi[1] - mini[1])) + mini[1]
        type = carte[y][x]
      }
      // console.log("getRandomCoords", y, x)
      return [y, x]
    }
    return null
  }



  const handleMortHab=()=>{
    var r = {...resultats}
    r.Decedes=r.Decedes+1
    setResultats(r)
    // console.log("mort d'un habitant")
    
  }


  const handleExplosion=(randomPos,c)=>{
    const mursAutour = getMursAutour(randomPos)
    // console.log(mursAutour)

    // MARQUEURS SUR LA CASE QUI EXPLOSE
    mursAutour.forEach((val,index)=>{
      var valeurFin =val
      if([3,5].includes(val)) valeurFin = 4 // DESTRUCTION TOTALE
      if(valeurFin==1) valeurFin=3



      if(valeurFin==3 || valeurFin==4){
        switch (index) {
          case 0:
            try {
              updateMurH([randomPos[0], randomPos[1]], valeurFin)
            }catch{}
            break;
          case 1:
            try {
              updateMurV([randomPos[0], randomPos[1] + 1], valeurFin)
            }catch{}
            
            break;
          case 2:
            try {
              updateMurH([randomPos[0] + 1, randomPos[1]], valeurFin)
            }catch{}
           
            break;
          case 3:
            try {
              updateMurV([randomPos[0], randomPos[1]], valeurFin)
            }catch{}
            
            break;
        }
      
      }
    })

    // PROPAGATION DANS LES DIFFERENTES DIRECTIONS

    const mursInterdits= [1,2,3,5]
    if(randomPos[1]<nbColonnesGrille-1 && c[randomPos[0]][randomPos[1]+1]==4){ // Propagation droite
      // console.log("propa droite")
      let j=1
      while(randomPos[1]+1+j<nbColonnesGrille){
        
        const type = c[randomPos[0]][randomPos[1]+1+j]
        if(Math.floor( type/ 10)==2){
          c[randomPos[0]][randomPos[1]+1+j]=4
          handleMortHab()
        }

        if(Math.floor(type / 1000) == 1){
          if (type % 100 < 10){
            c[randomPos[0]][randomPos[1]+1+j]=type - (type % 100 - type % 10)
            handleMortHab()
          }else{
            // console.log("mort d'un pompier solo")
          }
        } 


        if(c[randomPos[0]][randomPos[1]+1+j]==3 || c[randomPos[0]][randomPos[1]+1+j] ==0) {
          c[randomPos[0]][randomPos[1]+1+j]=4
          break
        }
        const mur = getMursAutour([randomPos[0],randomPos[1]+1+j])[1]
        if(mursInterdits.includes(mur)) {
            try {
              updateMurV([randomPos[0], randomPos[1] + 2 +j], 4)
              break
            }catch{}
          
        }
        j+=1
        
      }
    }
    if(randomPos[1]>0 && c[randomPos[0]][randomPos[1]-1]==4){ // Propagation gauche
      // console.log("propa gauche")
      let j=1
      while(randomPos[1]-1-j>=0){
        
        const type = c[randomPos[0]][randomPos[1]-1-j]
        if(Math.floor( type/ 10)==2){
          c[randomPos[0]][randomPos[1]-1-j]=4
          handleMortHab()
        }

        if(Math.floor(type / 1000) == 1){
          if (type % 100 < 10){
            c[randomPos[0]][randomPos[1]-1-j]=type - (type % 100 - type % 10)
            handleMortHab()
          }else{
            // console.log("mort d'un pompier solo")
          }
        } 


        if(c[randomPos[0]][randomPos[1]-1-j]==3 || c[randomPos[0]][randomPos[1]-1-j] ==0) {
          c[randomPos[0]][randomPos[1]-1-j]=4
          // console.log("break type",randomPos[1]-1-j)
          break
        }
        const mur = getMursAutour([randomPos[0],randomPos[1]-1-j])[3]
        // console.log(murs)
        if(mursInterdits.includes(mur)) {
            try {
              updateMurV([randomPos[0], randomPos[1]-j-1], 4)
              break
            }catch{}
          
        }
        j-=1
        
      }
    }
    if(randomPos[0]>0 && c[randomPos[0]-1][randomPos[1]]==4){ // Propagation haut
      // console.log("propa haut")
      let i=1
      while(randomPos[0]-1-i>=0){
        
        const type = c[randomPos[0]-1-i][randomPos[1]]
        if(Math.floor( type/ 10)==2){
          c[randomPos[0]-1-i][randomPos[1]]=4
          handleMortHab()
        }

        if(Math.floor(type / 1000) == 1){
          if (type % 100 < 10){
            c[randomPos[0]-1-i][randomPos[1]]=type - (type % 100 - type % 10)
            handleMortHab()
          }else{
            // console.log("mort d'un pompier solo")
          }
        } 


        if(c[randomPos[0]-1-i][randomPos[1]]==3 || c[randomPos[0]-1-i][randomPos[1]] ==0) {
          c[randomPos[0]-1-i][randomPos[1]]=4
          // console.log("break type",randomPos[1]-1-j)
          break
        }
        const mur = getMursAutour([randomPos[0]-1-i,randomPos[1]])[0]
        // console.log(murs)
        if(mursInterdits.includes(mur)) {
            try {
              updateMurH([randomPos[0]-1-i,randomPos[1]], 4)
              break
            }catch{}
          
        }
        i-=1
        
      }
    }

    if(randomPos[0]<nbLignesGrille-1 && c[randomPos[0]+1][randomPos[1]]==4){ // Propagation bas
      // console.log("propa bas")
      let i=0
      while(randomPos[0]+1+i>=0){
        
        const type = c[randomPos[0]+1+i][randomPos[1]]
        if(Math.floor( type/ 10)==2){
          c[randomPos[0]+1+i][randomPos[1]]=4
          handleMortHab()
        }

        if(Math.floor(type / 1000) == 1){
          if (type % 100 < 10){
            c[randomPos[0]+1+i][randomPos[1]]=type - (type % 100 - type % 10)
            handleMortHab()
          }else{
            // console.log("mort d'un pompier solo")
          }
        } 


        if(c[randomPos[0]+1+i][randomPos[1]]==3 || c[randomPos[0]+1+i][randomPos[1]] ==0) {
          c[randomPos[0]+1+i][randomPos[1]]=4
          // console.log("break type")

          break
        }
        const mur = getMursAutour([randomPos[0]+1+i,randomPos[1]])[2]
        if(mursInterdits.includes(mur)) {
            try {
              updateMurH([randomPos[0]+2+i,randomPos[1]], 4)
              break
            }catch{}
          
        }
        i+=1
        
      }
    }
    return c

  }

  const addFumToCarte = (randomPos) => {

    var c = [...carte]
    if (carte !== null && carte !== undefined && carte.length > 0 && randomPos !== null) {
      // console.log("addFumToCarte", randomPos[0], randomPos[1])

      switch (c[randomPos[0]][randomPos[1]]) {
        case 0: // VIDE
        // console.log("vide => fum")
          c[randomPos[0]][randomPos[1]] = 3
          break;

        case 3: // FUMEE
        // console.log("fum => feu")
          c[randomPos[0]][randomPos[1]] = 4
          break;

        case 4: // FEU

          c=handleExplosion(randomPos,c)

          // console.log("feu => explosion")
          break;

        default:
          // console.log("error")
          break;
      }
    }
    return c
  }


  const embrasementFum = (c) => {
    var modified = false
    if (c !== null && c !== undefined && c.length > 0) {
      const mursInterdits = [1, 2, 3, 5]
      var i = -1
      var j = -1
      
      while (i < nbLignesGrille - 1 ) {
        i = i + 1
        while (j < nbColonnesGrille - 1 ) {
          j = j + 1
          const mursCote = [mursH[i][j], mursV[i][j + 1], mursH[i + 1][j], mursV[i][j]]

          if (i < c.length && j < c[0].length && c[i][j] == 4) { // ON PARCOURT LES FEUX
            if (i > 0 && c[i - 1][j] == 3 && !mursInterdits.includes(mursCote[0])) {// juste dessus
              c[i - 1][j] = 4
              modified = true
            }
            if (j < nbColonnesGrille - 1 && c[i][j + 1] == 3 && !mursInterdits.includes(mursCote[1])) { // juste droite
              c[i][j + 1] = 4
              modified = true
            }
            if (i < nbLignesGrille - 1 && c[i + 1][j] == 3 && !mursInterdits.includes(mursCote[2])) { // juste dessous
              c[i + 1][j] = 4
              modified = true
            }else{
              
            }
            if (j > 0 && c[i][j - 1] == 3 && !mursInterdits.includes(mursCote[3])) { // GAUCHE
              c[i][j - 1] = 4 
              modified = true
            }
            
          }
        }
        j = -1
      }

      if(modified){
          embrasementFum(c)
        
        modified = false
      }




      // console.log(mursCote)











      
    }else{
      // console.log("test")
    }
    // console.log("embrasementFum")
    return c
  }
  const countHab = (carte) => {
    if (carte != null && carte.length > 0) {
      var count = 0
      carte.forEach((ligne, indexI) => {
        ligne.forEach((valeur, indexJ) => {

          if (Math.floor(valeur / 10) == 2) {
            count+=1
          }

        })
      });
      return count
    }
   
  }

  const addHabitants=(c)=>{
    const count = countHab(c)
    // console.log(count)
    for(let i=0;i<configuration.nbHabitantsASauver.valeur-count;i++){
      const newPos = getRandomCoords([0, 0], [nbLignesGrille, nbColonnesGrille])
      c[newPos[0]][newPos[1]]=20+Math.round(Math.random())
    }
    // console.log(countHab(c))
    return c

  }


  const evenementsAleatoire = () => {
    const randomPos = getRandomCoords([0, 0], [nbLignesGrille, nbColonnesGrille])
    // const randomPos=[2,9]
    var c = addFumToCarte(randomPos)
    c = embrasementFum(c)
    c = addHabitants(c)
    return c
  }


  // const [tester,setTester]=useState(false)


  // useEffect(()=>{
  //   if(!tester && carte !== null && carte !== undefined && carte.length>0 && nbLignesGrille>0 && nbColonnesGrille>0){
  //     setTester(true)
  //     console.log([...carte])
  //     evenementsAleatoire()
      
  //   }

    
  // },[tester,carte,nbLignesGrille,nbColonnesGrille])





















  const [textes, setTextes] = useState(null)

  useEffect(() => {
    const getTextes = async () => {
      const textes = ContentsAPI.getTexts("jeuTactInterface").then(
        (res) => { setTextes(res) }
      )
    }
    if (textes == null) {
      getTextes()
    }
    // console.log(textes)
  }, [textes])




  const getText = (name) => {
    if (textes == null) {
      return name
    } else {
      try {
        return textes[name].contenu
      } catch (error) {
        // console.log(textes)
        return name
      }
    }
  }


  const renderAttenteLancement = () => {

    return (
      <div style={{ color: "gray", textAlign: "center", fontSize: 20 }}>
        <Typography >{getText('attenteLancement')}</Typography>
        <Typography >{getText('infoLancement')}</Typography>
      </div>
    )
  }
  
  return (



    <div style={{ position: "absolute", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", flex: 1, width: "100%", height: "100%" }}>

      {
        carte.length > 0 && position != null && stocks !== null && numPompier !== null && play ?
          <>

            <Grille
              nbColonnesGrille={nbColonnesGrille}
              nbLignesGrille={nbLignesGrille}
              carte={carte}
              position={position}
              mursH={mursH}
              mursV={mursV}
              propositionMursDetruire={propositionMursDetruire}
              propositionsCase={propositionsCase}
              handleClicMur={handleClicMur}
              handleClicCase={handleClicCase}
              handleChangePiece={handleChangePiece}
              deplacementEnCours={deplacementEnCours}

            />

            <TactBandeauTop
              stocks={stocks}
              resultats={resultats}
              numeroPompier={numPompier}
              sequence={currentSequence}
              cycle={currentCycle}
              tour={currentTour}
              pomp={currentPomp}
              configuration={configuration}
              budget={budget}
              budgetDepense={budgetDepense}
              equipe={equipe}
              handleClicValidated={handleClicValidated}
              play={play}
              chronoInit={chrono}
              numEquipe={equipe}
              numSession={session}
            />

            <TactBandeauBottom
              interventions={interventions}
              stocks={stocks}
              numeroPompier={numPompier}
              tour={currentTour}
              pomp={currentPomp}
              handleClicFleche={handleClicFleche}
              handleClicValidated={handleClicValidated}
              handleClicDoor={handleClicDoor}
              handleClicMarqueur={handleClicMarqueur}
              handleClicExt={handleClicExtincteur}
              handleNoClicked={handleNoClicked}
              handleClicHabitant={handleClicHabitant}
              btnClickedBottom={btnClickedBottom}
              mursAutour={getMursAutour(position)}
              casesAutour={getCasesAutour()}
              currentCase={carte[position[0]][position[1]]}
              histActions={histActions}
              configuration={configuration}
              deplacementEnCours={deplacementEnCours}
              budgetMaxAtteint={budgetDepense >= configuration.budgetTourMax.valeur}
              isLoading={false}
            />
            <TactBandeauDroite
              handleDisconnect={handleDisconnect}
              configuration={configuration}
            />
          </>
          :
          renderAttenteLancement()

      }
    </div>







  );

}

export default TactInterface;


// export default React.memo(TactInterface)