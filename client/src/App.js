import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MyTheme from './styles/MyTheme';
import { ThemeProvider } from '@material-ui/styles';

import TactInterface from "./routes/TactInterface"
import InterInterface from "./routes/InterInterface"
import Login from "./routes/Login"
import Accueil from "./routes/Accueil"
import PrivateRoute from "./routes/PrivateRoute";
import AdminInterface from "./routes/AdminInterface";


export default function App() {

    const [userConnected,setUserConnected]=useState(null)

    const handleLogin=(value)=>{
        // console.log(value)
        setUserConnected(value)
    }

    const handleDisconnectApp=()=>{
      setUserConnected(null)
    }
    // useEffect(()=>{
    //     console.log(userConnected)
    // },[userConnected])



    


  return (
    <ThemeProvider theme={MyTheme}>

    <Router>
      {/* <div style={{
          position:"absolute",
          top:250,
          zIndex:50
          }}>
        <nav>
          <ul>
            <li>
              <Link to="/tact">Interface Tact</Link>
            </li>
            <li>
              <Link to="/inter">Interface Inter</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
        </div> */}
        <Switch>
          <PrivateRoute 
            userConnected={userConnected}
            path="/tact"
            component={TactInterface }
          />
            <PrivateRoute 
            userConnected={userConnected}
            path="/inter"
            component={InterInterface }
          />
          <PrivateRoute path="/admin"
          userConnected={userConnected}
            component={AdminInterface }
          />
       
          <Route path="/login">
            <Login 
                userConnected={userConnected}
                handleLogin={handleLogin}
                handleDisconnectApp={handleDisconnectApp}
            />
          </Route>
          <Route path="/">
            <Accueil />
          </Route>
          
          
        </Switch>
      
    </Router>
  </ThemeProvider>
    );
}