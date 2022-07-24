import '../styles/App.css';
import '../styles/Login.css'
import { useEffect, useState } from 'react';
import { TextField, Button, Divider, Typography } from "@material-ui/core"
import UsersAPI from "../API/UsersAPI"
import ContentsAPI from "../API/ContentsAPI"
import { useHistory } from 'react-router-dom';


import cookie from 'react-cookies'

const Login = ({
  handleLogin,
  userConnected,
  handleDisconnectApp
}) => {

  const history = useHistory()

  const [user, setUser] = useState(userConnected)
  const [error,setError]=useState(null)

  const handleConnect = async (e) => {
    e.preventDefault()
    const response = await UsersAPI.login(dataConnection)
    if (response.id != null) {
      setError(null)
      
      setUser(response)
      
    } else {
      setError("erreurConnexion")
      handleLogin(null)
    }
  }
  const [textes, setTextes] = useState(null)

  useEffect(() => {
      const getTextes = async () => {
          const textes = ContentsAPI.getTexts("jeuLogin").then(
              (res) => { setTextes(res) }
          )
      }
      if (textes == null) {

          getTextes()
          
      }
  }, [textes])


  const getText = (name) => {
    if (textes == null) {
        return name
    } else {
        try {
            return textes[name].contenu
        } catch (error) {
            return name
        }
    }
}

  useEffect(() => {
    
    if (user != null ) {
      if(cookie.load('user')!=="disconnected"){
        if(cookie.load('user')!=null ) cookie.remove('user')
        cookie.save('user', user, { 
          path: '/',
          maxAge: 60*60*1.5, //sec
        })
        handleLogin(user)
        if (user.role.includes("TACT")) {
          history.push("/tact");
        } else if (user.role.includes("INTER")) {
          history.push("/inter");
        }else if (user.role.includes("ADMIN")) {
          history.push("/admin");
        }
      }else{
        setUser(null)
        cookie.remove('user', { path: '/' })
        handleDisconnectApp()
      }
      

    }
  }, [user])

  const [dataConnection, setDataConnection] = useState({
    identifiant: "",
    mdp: ""
  })



  const onChange = (e) => {
    setError(null)
    var data = {
      identifiant: dataConnection.identifiant,
      mdp: dataConnection.mdp
    }
    data[e.target.name] = e.target.value
    setDataConnection(data)
  }




  return (
    <>
      <div
        className="body-login"
      >

        <Typography variant="h1" color="primary">Connexion</Typography>
        {/* <Typography variant="subtitle1">Texte à ajouter</Typography> */}



        <div
          className="login-image-container"
        >
          <img
            src='./assets/Login.png'
          />
          <Divider orientation="vertical" flexItem />
          <form method="post" className="login-form" >
            <TextField
              required
              label="Identifiant"
              variant="outlined"
              name={"identifiant"}
              value={dataConnection.identifiant}
              onChange={onChange}
              className="login-field"
              color="primary"
              inputProps={{style: {fontSize: 25}}}
              InputLabelProps={{style: {fontSize: 20}}}
            />
            <TextField
              required
              label="Mot de passe"
              variant="outlined"
              name="mdp"
              value={dataConnection.mdp}
              onChange={onChange}
              type="password"
              className="login-field"
              color="primary"
              inputProps={{style: {fontSize: 25}}}
              InputLabelProps={{style: {fontSize: 20}}}
              onKeyUp={(event) => {
                if (!event.ctrlKey && event.key== 'Enter')
                  handleConnect(event)
                }}
            />
            <Typography  color="primary">{textes!=null && error!==null ? getText(error) : ""}</Typography>
            <div className="login-buttons-container">
              <Button
                variant="contained"
                onClick={() => history.push("/")}
                className="login-button retour"
                color="default"
                disabled={true}
                
              >
                Retour
              </Button>
              <Button
                variant="contained"
                onClick={handleConnect}
                className="login-button connect"
                color="primary"

              >
                Se connecter
              </Button>
            </div>
          </form>

        </div>

      </div>
      </>
  );
}

export default Login;
