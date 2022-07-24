import "../styles/AdminInterface.css"
import "../styles/App.css"
import React, { useState, useEffect, useRef } from 'react'
import PlayAPI from "../API/PlayAPI"
import UsersAPI from "../API/UsersAPI"

import { useHistory } from 'react-router-dom';
import { TextField, Button, Divider, Typography, TableContainer, TableHead, TableRow, Paper, TableBody, Table, TableCell } from "@material-ui/core"
import io from 'socket.io-client'

import cookie from 'react-cookies'
import { config } from "react-transition-group";

const AdminInterface = () => {
  // console.log("admin")
  const history = useHistory()


  const user = cookie.load("user")
  // console.log(user)
  const handleDisconnect = () => {
    // console.log("handleDisconnect")
    cookie.save('user', "disconnected", {
      path: '/',
      maxAge: 60 * 60 * 1.5, //sec
    })
    history.push('/login');
  }


  if (user === null || user === undefined || user == "disconnected") history.push("/login");
  if (user !== null && user !== undefined && user.role !== undefined && !user.role.includes("ADMIN")) handleDisconnect()

  const [session, setSession] = useState(user !== null && user !== undefined ? user.session : null)

  const [configuration, setConfiguration] = useState(null)
  const [manualConfig, setManualConfig] = useState(null)

  const [lancement, setLancement] = useState(true)
  const isLoading = useRef(false)

  const [socket, setSocket] = useState(null)
  useEffect(() => {
    if (socket == null && configuration !== null) {
      const s = io("https://www.back.leaders-extreme.fr")
      
      s.on('startStopPartie', (data) => {
        setLancement(!data.start)
        // console.log(!data.start)
      });

      s.on('connect_error', err => console.log("error",err));
      s.on('connect_failed', err => console.log("failed",err));
      setSocket(s)
    }
  })

  const getPlayParameters = async () => {
    if (configuration === null) {
      setConfiguration(await PlayAPI.getConfiguration(session))
    }
  }
  useEffect(() => {
    getPlayState(session)
    setManualConfig(configuration)
  }, [configuration])

  const getPlayState = async (session) => {

    if (!isLoading.current && configuration != null) {

      isLoading.current = true
      const currentPlayState = await PlayAPI.getPlayState(session, null)
      if (currentPlayState !== undefined) {
        setLancement(!JSON.parse(currentPlayState.valeur))
      } else {
        console.log("error")
      }
      // getPositionFromCarte(JSON.parse(currentPlayState.carte.valeur))
      isLoading.current = false
    } else {
      // console.log(configuration)
    }

  }

  useEffect(() => {
    getPlayParameters()
  })


  const handleClicLancement = async () => {
    await PlayAPI.startStopPartie(socket, session, lancement)
  }

  const handleClicDisconnect = async () => {
    // console.log("handleClic disc")
    setLancement(true)
    PlayAPI.disconnectUsers(socket, session)
  }

  const configChange = (evt) => {
    const name = evt.target.name
    const val = evt.target.value

    if(parseInt(val)>=0){
      var c = { ...manualConfig }
      c[name].valeur = parseInt(val)
      setManualConfig(c)
    }

    
    // console.log(name,val)
  }

  // useEffect(() => {
  //   console.log(manualConfig)
  // }, [manualConfig])

  const handleConfigChange = () => {
    console.log("départ")
    setLancement(true)
    PlayAPI.updateConfig(manualConfig, session).then(() => {
      handleClicDisconnect()
    })
  }

  const [nbEquipes, setNbEquipes] = useState(null)

  const countEquipes = async () => {
    const count = (await UsersAPI.getNbEquipes(session)).count
    // console.log(count)
    setNbEquipes(count)
    return count
  }
  const [users, setUsers] = useState(null)
  useEffect(() => {
      if(nbEquipes==null){
        countEquipes()
        getIdents()
      }
      
  }, [nbEquipes])

  useEffect(()=>{
    countEquipes()
  },[users])

  const createIdents = async () => {
    // console.log(users)
    
    const us = await UsersAPI.getUsers(session)
    console.log(us)
    setUsers(us)
    UsersAPI.createUsers(session, nbEquipes, us).then(() => {
      handleClicDisconnect()
      getIdents()
      setLancement(true)
    }
    )

  }





  const getIdents = async () => {
    setUsers(await UsersAPI.getUsers(session))
  }

  const resetPartie=async()=>{
    // const count = countEquipes()
    // console.log(count)
    // const etats =await  PlayAPI.getGeneralStats(session)

    handleClicDisconnect()
     PlayAPI.getGeneralStats(session).then((res)=>{
      //  console.log(res)
       PlayAPI.resetPartie(nbEquipes,session,res,manualConfig.chronoTourInter.valeur).then(()=>{
        setLancement(true)
       })
     })
    // PlayAPI.resetPartie(nbEquipes,session)

  }


  const renderUsers = () => {
    if (users !== null) {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Equipe</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Identifiant</TableCell>
                <TableCell align="center">Mot de passe</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.identifiant + " : " + u.equipe + " : " + u.role}>
                  <TableCell align="center">{u.equipe}</TableCell>
                  <TableCell align="center">{u.role}</TableCell>
                  <TableCell align="center">{u.identifiant}</TableCell>
                  <TableCell align="center">{u.mdp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>)
    }

    return null

  }




  return (
    <div
      className="body-admin"
    >

      <Typography variant="h1" color="primary">Espace administrateur</Typography>

      <div className="admin-buttons-container">
        <Button
          variant="contained"

          className="admin-button"
          color={lancement ? "default" : "primary"}
          onClick={handleClicLancement}
        // disabled={lancement}
        >
          {lancement ? "Lancer la partie" : "Mettre la partie sur pause"}
        </Button>
        <Divider />
        <Button
          variant="contained"

          className="admin-button"
          color={"primary"}
          onClick={handleClicDisconnect}
        // disabled={lancement}
        >
          {"Déconnecter les utilisateurs et mettre sur pause"}
        </Button>
        <Button
          variant="contained"

          className="admin-button"
          color={"primary"}
          onClick={resetPartie}
        // disabled={lancement}
        >
          {"Déconnecter les utilisateurs et Relancer la partie"}
        </Button>
        <Divider />
        {
          manualConfig !== null && manualConfig !== undefined && nbEquipes !== null ?
            <form method="post" className="login-form" >

              <div className="admin-buttons-config-container">
                <TextField
                  // required
                  label="Chrono Intermédiaire (s)"
                  type="number"
                  // variant="outlined"
                  name={"chronoTourInter"}
                  value={manualConfig.chronoTourInter.valeur}
                  onChange={(evt) => configChange(evt)}
                  className="login-field"
                  color="primary"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <TextField
                  // required

                  type="number"
                  label="Chrono Tactique (s)"
                  // variant="outlined"
                  name={"chronoTourTact"}
                  value={manualConfig.chronoTourTact.valeur}
                  onChange={(evt) => configChange(evt)}
                  className="login-field"
                  color="primary"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />
              </div>
              <div className="admin-buttons-config-container">
                <TextField
                  // required
                  label="Nombre de séquences"
                  type="number"
                  // variant="outlined"
                  name={"nbSequences"}
                  value={manualConfig.nbSequences.valeur}
                  onChange={(evt) => configChange(evt)}
                  className="login-field"
                  color="primary"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <TextField
                  // required

                  type="number"
                  label="Budget cycle intermédiaire"
                  // variant="outlined"
                  name={"budgetDefaultInter"}
                  value={manualConfig.budgetDefaultInter.valeur}
                  onChange={(evt) => configChange(evt)}
                  className="login-field"
                  color="primary"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />
              </div>
              <div className="admin-buttons-config-container">

                <TextField
                  // required

                  type="number"
                  label="Nombre de marqueurs max"
                  // variant="outlined"
                  name={"nbMarqueursMax"}
                  value={manualConfig.nbMarqueursMax.valeur}
                  onChange={(evt) => configChange(evt)}
                  className="login-field"
                  color="primary"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <TextField
                  // required

                  type="number"
                  label="Nombre de victimes max"
                  // variant="outlined"
                  name={"nbVictimesMax"}
                  value={manualConfig.nbVictimesMax.valeur}
                  onChange={(evt) => configChange(evt)}
                  className="login-field"
                  color="primary"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <TextField
                  // required

                  type="number"
                  label="Nombre d'habitants à sauver"
                  // variant="outlined"
                  name={"nbHabitantsASauver"}
                  value={manualConfig.nbHabitantsASauver.valeur}
                  onChange={(evt) => configChange(evt)}
                  className="login-field"
                  color="primary"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />
              </div>
              <Button
                variant="contained"

                className="admin-button"
                color={"primary"}
                onClick={handleConfigChange}
              >
                {"Modifier les paramètres"}
              </Button>
              <Divider />


              <Divider />
              <div className="admin-buttons-config-container">
                <TextField
                  // required

                  type="number"
                  label="Nombre d'équipes"
                  // variant="outlined"
                  name={"nbEquipes"}
                  value={nbEquipes}
                  onChange={evt =>{ 
                    if (parseInt(evt.target.value)>=0) setNbEquipes(parseInt(evt.target.value))
                  }}
                  className="login-field"
                  color="primary"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <Button
                  variant="contained"
                  disabled={users == null}
                  className="admin-button"
                  color={"primary"}
                  onClick={createIdents}
                >
                  {"Générer les identifiants"}
                </Button>
              </div>
            </form>
            : null
        }


        <div>
          {renderUsers()}
        </div>



      </div>

    </div>
  );
}

export default AdminInterface;

