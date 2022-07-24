import '../styles/App.css';
import '../styles/Login.css'
import { useEffect, useState } from 'react';
import { TextField, Button, Divider, Typography } from "@material-ui/core"
import UsersAPI from "../API/UsersAPI"
import ContentsAPI from "../API/ContentsAPI"
import { useHistory } from 'react-router-dom';


import cookie from 'react-cookies'

const Accueil = ({
}) => {

  const history = useHistory()


  const handleRedirect = async (e) => {
    e.preventDefault()
    history.push("/login")
  }



  return (
      <div
        className="body-login"
      >

              <Button
                variant="contained"
                onClick={handleRedirect}
                className="login-button connect"
                color="primary"

              >
                Lien de connexion
              </Button>

      </div>
  );
}

export default Accueil;
