import "../styles/App.css"
import React, { useState, useEffect, useRef } from 'react'
import PlayAPI from "../API/PlayAPI"
import InterBandeauTop from "../components/interfaceJoueur/InterBandeauTop"
import InterBandeauBottom from "../components/interfaceJoueur/InterBandeauBottom"
import Grille from "../components/interfaceJoueur/Grille"
import InterInterventions from "../components/interfaceJoueur/InterInterventions"
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client'

import cookie from 'react-cookies'
import InterBandeauDroite from "../components/interfaceJoueur/InterBandeauDroite"

import { Typography } from "@material-ui/core"
import ContentsAPI from "../API/ContentsAPI"


const InterInterface = () => {

  const history = useHistory()

  const user = cookie.load("user")
  const handleDisconnect = () => {
    cookie.save('user', "disconnected", {
      path: '/',
      maxAge: 60 * 60 * 1.5, //sec
    })
    history.push('/login');
  }

  if (user === null || user === undefined || user=="disconnected") history.push("/login");
  if(user !== null && user !== undefined && user.role!==undefined && !user.role.includes("INTER")) handleDisconnect()
  const [play,setPlay]=useState(false)


  const [numPompier, setNumPompier] = useState(0)
  const [currentPomp, setCurrentPomp] = useState(null)
  const [currentTour, setCurrentTour] = useState(null)
  const [currentCycle, setCurrentCycle] = useState(null)
  const [currentSequence, setCurrentSequence] = useState(null)

  const [session, setSession] = useState(user !== null && user !== undefined ? user.session : null)
  const [equipe, setEquipe] = useState(user !== null && user !== undefined ?  user.equipe : null)
  const [chrono, setChrono]=useState(null)
  const [vue, setVue] = useState("operations")



  const [configuration, setConfiguration] = useState(null)



  const [couts, setCouts] = useState(null)



  const [resultats, setResultats] = useState({
    Decedes: 0,
    Sauves: 0,
    Marqueur: 0
  })


  const [budget, setBudget] = useState({
    sequence: 0,
    depense: 0
  })


  const [cycles, setCycles] = useState(null)

  useEffect(() => {

    if (configuration != null) {

      setCouts({
        interventions: {
          coutInterDeplacement: configuration.coutInterDeplacement.valeur,
          coutInterDeplacementHab: configuration.coutInterDeplacementHab.valeur,
          coutInterFeu: configuration.coutInterFeu.valeur,
          coutInterFeuFum: configuration.coutInterFeuFum.valeur,
          coutInterFum: configuration.coutInterFum.valeur,
          coutInterMarqueur: configuration.coutInterMarqueur.valeur,
          coutInterPorte: configuration.coutInterPorte.valeur,
          coutInterHab: configuration.coutInterHabitant.valeur,
        },
        equipements: {
          coutEqFeu: configuration.coutEqFeu.valeur,
          coutEqFeuFum: configuration.coutEqFeuFum.valeur,
          coutEqFum: configuration.coutEqFum.valeur,
          coutEqMarqueur: configuration.coutEqMarqueur.valeur,

        }
      })
      setBudget({
        interventions:{
          sequence: configuration.budgetDefaultInter.valeur,
          depense: 0
        },
        equipements:{
          sequence: configuration.budgetDefaultInter.valeur,
          depense: 0
        }
        
      })

      if (cycles != null) {
        initInfos(cycles)
      }

    }
  }, [configuration])



  const [budgetSim, setBudgetSim] = useState(null)




  useEffect(() => {
    if (cycles != null) {
      // console.log("save bdg init")
      PlayAPI.saveBudgetsPompInit(cycles, session, equipe).then(()=>{
        if (configuration != null) {
          initInfos(cycles)
        }
  
        if(budgetSim==null || budgetSim.interventions==undefined || budgetSim.interventions.numCycle!==(cycles.interventions.length) % 2 + 1 || budgetSim.equipements.numCycle!==(cycles.equipements.length) % 2 + 1){
          setBudgetSim({
            interventions: {
              numSeq: cycles.interventions.length > 1 ? cycles.interventions.length % 2 == 0 ? cycles.interventions[cycles.interventions.length - 1].numSeq + 1 : cycles.interventions[cycles.interventions.length - 1].numSeq : 1,
              numCycle: (cycles.interventions.length) % 2 + 1,
              pomp1: 0,
              pomp2: 0,
              pomp3: 0,
              pomp4: 0,
              pomp5: 0,
              pomp6: 0,
            },
            equipements: {
              numSeq: cycles.equipements.length > 1 ? cycles.equipements.length % 2 == 0 ? cycles.equipements[cycles.equipements.length - 1].numSeq + 1 : cycles.equipements[cycles.equipements.length - 1].numSeq : 1,
              numCycle: (cycles.equipements.length) % 2 + 1,
              Feu: {
                pomp1: 0,
                pomp2: 0,
                pomp3: 0,
                pomp4: 0,
                pomp5: 0,
                pomp6: 0,
              },
              FeuFum: {
                pomp1: 0,
                pomp2: 0,
                pomp3: 0,
                pomp4: 0,
                pomp5: 0,
                pomp6: 0,
              },
              Fum: {
                pomp1: 0,
                pomp2: 0,
                pomp3: 0,
                pomp4: 0,
                pomp5: 0,
                pomp6: 0
              },
              Marqueur: {
                pomp1: 0,
                pomp2: 0,
                pomp3: 0,
                pomp4: 0,
                pomp5: 0,
                pomp6: 0,
              },
            },
          })
      }
    })
    }


    // console.log(cycles.equipements)
  }, [cycles])

  const [validated, setValidated] = useState({
    interventions:false,
    equipements:false
    
  })
  // const [page, setPage] = useState({
  //   interventions: 0,
  //   equipements: 0
  // })



  const isLoading = useRef(false)

  // INITIALISATION DE LA CARTE

  const [carte, setCarte] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ])

  // const [carte, setCarte] = useState([])

  const [nbLignesGrille, setNbLignesGrille] = useState(0)
  const [nbColonnesGrille, setNbColonnesGrille] = useState(0)
  const [position, setPosition] = useState(null)


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


  const getNombreMarqueur = (mursH, mursV) => {
    let nbMarqueur = 0
    mursH.forEach(ligne => {
      ligne.forEach(valeur => {
        if (valeur == 3) nbMarqueur = nbMarqueur + 1
        if (valeur == 4) nbMarqueur = nbMarqueur + 2
      })
    })
    mursV.forEach(ligne => {
      ligne.forEach(valeur => {
        if (valeur == 3) nbMarqueur = nbMarqueur + 1
        if (valeur == 4) nbMarqueur = nbMarqueur + 2
      })
    })
    return nbMarqueur
  }

  // GET PLAY PARAMETERS 



  const initInfos = (cycles) => {
    if (cycles !== null && configuration !== null) {
      console.log("init infos")
      const lastCycleEq = [...cycles.equipements].sort((a, b) => (a.numSeq - b.numSeq) * 100 + a.numCycle - b.numCycle)[[...cycles.equipements].length - 1]
      const lastCycleInter = [...cycles.interventions].sort((a, b) => (a.numSeq - b.numSeq) * 100 + a.numCycle - b.numCycle)[[...cycles.interventions].length - 1]

      var val = {
        interventions: false,
        equipements: false
      }

      if (lastCycleInter !== null && lastCycleInter !== undefined && lastCycleInter.numSeq == currentSequence && lastCycleInter.numCycle == currentCycle) val.interventions = true
      if (lastCycleEq !== null && lastCycleEq !== undefined && lastCycleEq.numSeq == currentSequence && lastCycleEq.numCycle == currentCycle) val.equipements = true
      setValidated(val)

      var b = {
        interventions:{
          sequence: configuration.budgetDefaultInter.valeur,
          depense: getBudgetTot(budgetSim,"interventions")
        },
        equipements:{
          sequence: configuration.budgetDefaultInter.valeur,
          depense: getBudgetTot(budgetSim,"equipements")
        }
        
      }


      setBudget(b)
    }

  }

  useEffect(() => {
    initInfos(cycles)
  }, [couts])


  // useEffect(()=>{
  //   console.log(chrono)
  // },[chrono])



  const getPlayState = async (session, equipe) => {
    
    if (!isLoading.current && configuration != null) {
      
      isLoading.current = true
      console.log("getplaystate")
      const currentPlayState = await PlayAPI.getPlayState(session, equipe)
      console.log(currentPlayState)
      if (Object.keys(currentPlayState).length > 0) {

        // console.log(currentPlayState)
        setCurrentPomp(parseInt(JSON.parse(currentPlayState.currentPomp.valeur)))
        setCurrentTour(parseInt(JSON.parse(currentPlayState.currentTour.valeur)))
        setCurrentCycle(parseInt(JSON.parse(currentPlayState.currentCycle.valeur)))
        setCurrentSequence(parseInt(JSON.parse(currentPlayState.currentSequence.valeur)))
        const mursH = JSON.parse(currentPlayState.mursH.valeur)
        const mursV = JSON.parse(currentPlayState.mursV.valeur)
        setPlay(JSON.parse(currentPlayState.play.valeur))
        setMursH(mursH)
        setMursV(mursV)
        setCarte(JSON.parse(currentPlayState.carte.valeur))
        setResultats({
          Decedes: parseInt(JSON.parse(currentPlayState.resultatsDecedes.valeur)),
          Sauves: parseInt(JSON.parse(currentPlayState.resultatsSauves.valeur)),
          Marqueur: getNombreMarqueur(mursH, mursV)
        })
        setCycles(JSON.parse(currentPlayState.budgetsPompInit.valeur))
        const c = parseInt(JSON.parse(currentPlayState.currrentChrono.valeur))
        if (configuration !== null && c <= configuration.chronoTourInter.valeur && parseInt(JSON.parse(currentPlayState.currentPomp.valeur)) == numPompier) {
          setChrono(c)
        } else {
          setChrono(null)
          // console.log("chrono")
        }
        
        setPlay(JSON.parse(currentPlayState.play.valeur))
      }else{
        console.log("error")
      }
      // getPositionFromCarte(JSON.parse(currentPlayState.carte.valeur))
      isLoading.current = false
    }else{
      console.log(configuration)
    }

  }

  // useEffect(()=>{
  //   console.log(currentPomp)
  // },[currentPomp])


  useEffect(() => {
    // console.log(carte)
    if (carte.length > 0) {
      setNbLignesGrille(carte.length)
      setNbColonnesGrille(carte[0].length)
      setPosition([carte.length + 1, carte[0].length + 1])
    }

  }, [carte])

  useEffect(()=>{
    console.log(configuration)
  },[configuration])
  useEffect(() => {
    if(configuration===null) getPlayParameters()
    if (session != null && equipe != null && currentTour == null) {
      
      if (!isLoading.current && configuration!==null) getPlayState(session, equipe)
      
      // getPositionFromCarte()
    }
  }, [session, equipe, numPompier,configuration])

  const getPlayParameters = async () => {
    console.log("getPlay Parameters")
    const param =await PlayAPI.getConfiguration(session)
    setConfiguration(param)
    console.log(param)
  }




  const getBudgetTot = (budgetSim,type) => {
    let sum = 0

    if (couts !== null) {


      if(type=="interventions"){
        // if (budgetSim !== null && budgetSim !== undefined) {
        //   const lastCycleInter = [...cycles.interventions].sort((a, b) => (a.numSeq - b.numSeq) * 100 + a.numCycle - b.numCycle)[[...cycles.interventions].length - 1]
        //   if (budgetSim.interventions.numSeq == currentSequence && budgetSim.interventions.numCycle > currentCycle || lastCycleInter === undefined) {
        //     Object.keys(budgetSim.interventions).forEach((key) => {
        //       if (key != "numCycle" && key != "numSeq") {
        //         console.log("test")
        //         sum += budgetSim.interventions[key]
        //       }
        //     })
        //   }


          
        // }
        cycles.interventions.forEach((c) => {
          if (c.numSeq == currentSequence) {
            Object.keys(c).forEach((key) => {
              if (key != "numCycle" && key != "numSeq") {
                // console.log(c[key])
                sum += c[key]
              }
            })
          }
        })
      }else{


        const lastCycleEq = [...cycles.equipements].sort((a, b) => (a.numSeq - b.numSeq) * 100 + a.numCycle - b.numCycle)[[...cycles.equipements].length - 1]
      

        // if (budgetSim.equipements.numSeq == currentSequence && budgetSim.equipements.numCycle > currentCycle || lastCycleEq === undefined) {
        //   Object.keys(budgetSim.equipements).forEach((key) => {
        //     if (key != "numCycle" && key != "numSeq") {
        //       Object.values(budgetSim.equipements[key]).forEach(value => {
        //         sum += value * couts.equipements["coutEq" + key]
        //       })
        //     }
        //   })
        // }

        cycles.equipements.forEach((c) => {
          if (c.numSeq == currentSequence) {
            Object.keys(c).forEach((key) => {
              if (key != "numCycle" && key != "numSeq") {
                Object.values(c[key]).forEach((v) => {
                  sum += couts.equipements["coutEq" + key] * v
                })
              }
  
            })
          }

      
        })

      }

    }
    return sum
  }
  // useEffect(()=>{
  //   if(budgetSim!==null){
  //     console.log(budgetSim.interventions)
  //   }
    
  // },[budgetSim])


  const handleBudgetChange = (type, newBudget) => {
    var bSim = { ...budgetSim }
    bSim[type] = newBudget
    setBudgetSim(bSim)
  }

  useEffect(()=>{
    if(validated.interventions && validated.equipements && numPompier == currentPomp) checkNouveauTour()
  },[validated,vue])

  const handleClicValidated = (type,bool) => {
    if(bool){
      var v = { ...validated }
      v[type] = true
      setValidated(v)
  
      // var p = { ...page }
      // if (type == "interventions") p[type] += 1
      // if (type == "equipements") p[type] += 1
      // setPage(p)
  
      var c = { ...cycles }
      c[type].push(budgetSim[type])
      setCycles(c)
      setChrono(null)
    }else{ // RETOUR
      console.log("clic retour vue ",type)

      var c = {...cycles}
      if(c[type]!==undefined){
        var bSim = {...budgetSim}
        bSim[type]=c[type][c[type].length-1]
        console.log(bSim)
        setBudgetSim(bSim)
        c[type].pop()
        setCycles(c)
  
  
        var v = { ...validated }
        v[type] = false
        setValidated(v)
      }
      
    }
  }



  const nouveauTour =  () => {
    isLoading.current=true
    if (configuration != null) {
      // if(bool){
      console.log("save bdg fin")
      PlayAPI.saveBudgetsPompFin(cycles, session, equipe).then((res)=>{
        let prochainPomp = 1
        let prochainTour = currentTour
        let prochainCycle = currentCycle
        let prochaineSequence = currentSequence
        let prochainChrono = configuration.chronoTourTact.valeur
  
  
  
        // if(numPompier==configuration.nbPompEquipe.valeur){ // DERNIER POMP DU TOUR
        //   if(currentTour==configu  ration.nbToursParCycle.valeur){ // SEND TO INTER
        //     prochainTour = 1
        //     prochainPomp=0 // A CHANGER AVEC STRATEGIQUE
  
        //     if(prochainCycle==configuration.nbCyclesParSequence.valeur){
        //       prochainCycle=1
        //       prochaineSequence=prochaineSequence+1
        //     }else{
        //       prochainCycle=prochainCycle+1
        //     }
  
  
        //   }else{ // PAS DERNIER TOUR DU CYCLE
        //     console.log("pas dernier tour")
        //     prochainPomp=1
        //     prochainTour=prochainTour+1
  
  
        //   }
  
        // }
        
         PlayAPI.nouveauTour(socket,prochainPomp, carte, mursH, mursV, prochaineSequence, prochainCycle, prochainTour, resultats.Decedes, resultats.Sauves, session, equipe,prochainChrono).then(()=>{
          console.log("nouveau tour")
          isLoading.current=false
         })
        
         
        
        // }else{
        //   // retourAction()
        // }
      })
      
         
        
      

     
    }
  }




  const checkNouveauTour =  () => {
    console.log("check nv tour")
    if (validated.interventions && validated.equipements && numPompier == currentPomp) {
      if(!isLoading.current){
        nouveauTour()
      }
      
    }
  }

  // SOCKETS
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    if (socket == null && configuration!==null) {
      const s = io("https://www.back.leaders-extreme.fr")
      s.emit("connecti",JSON.stringify({
        session:session,
        equipe:equipe
      }))
      
      s.on('changementTour', (data) => {

      
      // console.log(currentPomp != data.currentPomp)
      if (currentPomp != data.currentPomp || currentCycle !== data.currentCycle || currentTour !== data.currentTour || currentSequence !== data.currentSequence) {        

        getPlayState(session, equipe)
      }



    })

    s.on('startStopPartie', (data) => {
      setPlay(data.start)
    });

    // socket.on('revealHabitant',(data)=>{
    //   if(carte!==null && carte.length>0){
    //     // console.log(carte[data.y][data.x])
    //     // console.log(carte[data.y])
    //     if(carte[data.y][data.x]==20){
    //       // console.log([data.y,data.x])
    //       updateCarte([data.y,data.x],data.type)
    //       // console.log("socket hab")
    //       // console.log(data)
    //     }
    //   }
    // })
    setSocket(s)
  }
  },[socket,configuration]);

  
  const [textes, setTextes] = useState(null)

  useEffect(() => {
    const getTextes = async () => {
      const textes = ContentsAPI.getTexts("jeuInterInterface").then(
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





  const handleViewChange = (event, newValue) => {
    if (newValue != null) {
      setVue(newValue)
    }
  }
  // useEffect(() => {
  //   console.log(vue)
  // }, [vue])

  console.log(play)
  return (

    carte.length > 0 && position != null && configuration !== null && configuration !== undefined && budget != null && budget != undefined && couts!==null && couts!=undefined && play?

      <div style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", flex: 1, width: "100%", height: "100%" }}>
        <InterBandeauTop
          // stocks={stocks}
          numeroPompier={numPompier}
          numEquipe={equipe}
          numSession={session}
          sequence={currentSequence}
          cycle={currentCycle}
          tour={currentTour}
          pomp={currentPomp}
          configuration={configuration}
          handleViewChange={handleViewChange}
          vue={vue}
          interventionsValidated={validated.interventions}
          equipementsValidated={validated.equipements}
          play={play}
          handleClicValidated={handleClicValidated}
          chronoInit={chrono}
          validated={validated}
        />
        {
          vue == "operations" ?
            <Grille
              nbColonnesGrille={nbColonnesGrille}
              nbLignesGrille={nbLignesGrille}
              carte={carte}
              position={position}
              mursH={mursH}
              mursV={mursV}
            />
            : null
        }


        {
          vue == "interventions" && cycles != null ?

            <InterInterventions
              budget={{...budget.interventions}}
              cycles={[...cycles.interventions]}
              handleBudgetChange={handleBudgetChange}
              type="interventions"
              currentCycle={currentCycle}
              currentSequence={currentSequence}
              budgetSim={{ ...budgetSim.interventions }}
              couts={couts}
              nbCycleParSeq={configuration !== null ? configuration.nbCyclesParSequence.valeur : 0}
              configuration={configuration}
            // page={page.interventions}
            />
            : null
        }

        {
          vue == "equipements" && cycles != null ?

            <InterInterventions
              budget={{...budget.equipements}}
              cycles={[...cycles.equipements]}
              handleBudgetChange={handleBudgetChange}
              type="equipements"
              currentCycle={currentCycle}
              currentSequence={currentSequence}
              budgetSim={{ ...budgetSim.equipements }}
              couts={couts}
              nbCycleParSeq={configuration !== null ? configuration.nbCyclesParSequence.valeur : 0}
              configuration={configuration}
            // page={page.equipements}
            />
            : null
        }




        <InterBandeauBottom
          numeroPompier={numPompier}
          tour={currentTour}
          pomp={currentPomp}
          resultats={resultats}
          vue={vue}
          couts={couts}
          budget={vue === "interventions" ? budget.interventions : budget.equipements}
          validated={validated}
          handleClicValidated={handleClicValidated}
          equipe={equipe}
        />
        <InterBandeauDroite
          handleDisconnect={handleDisconnect}
          configuration={configuration}
        />
      </div>

      : renderAttenteLancement()

  );

}

export default InterInterface;

