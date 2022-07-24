import React, { useState, useEffect } from 'react'
import CaseDonnee from './panels/CaseDonnee'
import "../../styles/InterBandeauDroite.css"
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import ContentsAPI from "../../API/ContentsAPI"
import cookie from 'react-cookies'
import { useHistory } from 'react-router-dom';
const InterBandeauDroite = ({
    configuration,
    handleDisconnect
}) => {

    const [developpe, setDeveloppe] = useState(false)


    //     console.log(configuration)
    //     const [textes, setTextes] = useState(null)
    //     const [chrono,setChrono]=useState(null)
    //     useEffect(() => {
    //         if(tour==numeroPompier){
    //         if (chrono > 0) {
    //             var chronoTimer = setInterval(() => {
    //             setChrono(chrono => chrono - 1)

    //             }, 1000)

    //         }
    //         return () => {
    //         clearInterval(chronoTimer)
    //         }
    //     }
    //     }, [chrono])



    //   useEffect(()=>{
    //     if(chrono===null && configuration!==null){
    //       setChrono(configuration.chronoTour.valeur)
    //     }
    //   })

    //     useEffect(() => {
    //         // console.log("use effect")
    //         const getTextes = async () => {
    //             const textes = ContentsAPI.getTexts("jeuInterBandeauDroite").then(
    //                 (res) => { setTextes(res) }
    //             )
    //         }
    //         if (textes == null) {
    //             getTextes()
    //         }
    //     }, [textes])



    //     const getText = (name) => {
    //         if (textes == null) {
    //             return name
    //         } else {
    //             try {
    //                 return textes["label" + name.charAt(0).toUpperCase() + name.slice(1)].contenu
    //             } catch (error) {
    //                 console.log("label" + name.charAt(0).toUpperCase() + name.slice(1))
    //                 return name
    //             }
    //         }
    //     }



    //     const renderStocks = () => {
    //         return (
    //             <div
    //                 className="case-panel donnees-container"
    //                 style={{
    //                     flex: 3
    //                 }}
    //             >
    //                 <label
    //                     className="label-title"
    //                 >
    //                     {getText("stockEquipements")}
    //                 </label>
    //                 <div className="sous-donnees-container">
    //                     <CaseDonnee
    //                         key={0}
    //                         name={"nbExtFeu"}
    //                         value={stocks.Feu}
    //                         primary={false}
    //                         flexFactor={1}
    //                         textes={textes}

    //                     />
    //                     <CaseDonnee
    //                         key={1}
    //                         name={"nbExtFum"}
    //                         value={stocks.Fum}
    //                         primary={false}
    //                         flexFactor={1}
    //                         textes={textes}

    //                     />
    //                 </div>
    //                 <div className="sous-donnees-container">
    //                     <CaseDonnee
    //                         key={2}
    //                         name={"nbExtFeuFum"}
    //                         value={stocks.FeuFum}
    //                         primary={false}
    //                         flexFactor={2}
    //                         textes={textes}

    //                     />
    //                     <CaseDonnee
    //                         key={3}
    //                         name={"nbMarqueurs"}
    //                         value={stocks.Marqueur}
    //                         primary={false}
    //                         flexFactor={2}
    //                         textes={textes}

    //                     />
    //                 </div>
    //             </div>
    //         )
    //     }

    //     const renderResults = () => {
    //         return (
    //             <div
    //                 className="case-panel donnees-container"
    //                 style={{
    //                     flex: 2
    //                 }}
    //             >
    //                 <label
    //                     className="label-title"
    //                 >
    //                     {getText("resultats") + " " + numeroPompier}
    //                 </label>
    //                 <CaseDonnee
    //                     key={4}
    //                     name={getText("nbDecedes")}
    //                     value={resultats.Decedes}
    //                     primary={false}
    //                     flexFactor={0}
    //                 />
    //                 <CaseDonnee
    //                     key={5}
    //                     name={getText("nbSauves")}
    //                     value={resultats.Sauves}
    //                     primary={false}
    //                     flexFactor={0}
    //                 />
    //             </div>
    //         )
    //     }

    //     const renderNumPompier = () => {
    //         return (
    //             <div
    //                 className="case-panel"
    //                 style={{
    //                     flex: 1
    //                 }}
    //             >
    //                 <label
    //                     className="label-title"
    //                 >
    //                     {getText("numPompier")}
    //                 </label>
    //                 <div className="donnees-container">
    //                     <label
    //                         className="label-title label-num-pompier"
    //                     >
    //                         {numeroPompier}
    //                     </label>
    //                     <BookmarkRoundedIcon
    //                         className="icone-num-pompier"
    //                         fontSize="large"
    //                         stroke={"white"}
    //                         strokeWidth={1}
    //                     />
    //                 </div>
    //             </div>
    //         )
    //     }

    //     const renderCircleTours = () => {
    //         var type = 1, //circle type - 1 whole, 0.5 half, 0.25 quarter
    //             radius = 20, //distance from center
    //             start = -90, //shift start from 0
    //             // $elements = $('li:not(:first-child)'),
    //             numberOfElements = configuration.nbPompEquipe.valeur,
    //             slice = 360 * type / numberOfElements;

    //         const renderCircleItems = () => {
    //             var items = []
    //             const decalage = 1.2
    //             // items.push(
    //             //     <li
    //             //         key={"c"}
    //             //         style={{
    //             //             'transform': 'translate(' + (-radius*decalage*2) + 'px,'+ (-radius*decalage) +'px)',
    //             //             "backgroundColor": tour==-1 ? "#BF0000" : null
    //             //         }}

    //             //     >
    //             //         {"C"}
    //             //     </li>
    //             // )
    //             items.push(
    //                 <li
    //                     key={"s"}
    //                     style={{
    //                         'transform': 'translate(' + (radius*decalage) + 'px,'+ (-radius*decalage) +'px)',
    //                         "backgroundColor": tour==0 ? "#BF0000" : null
    //                     }}

    //                 >
    //                     {"S"}
    //                 </li>
    //             )

    //             for (let i = 0; i < numberOfElements; i++) {
    //                 const rotate = slice * i + start
    //                 const rotateReverse = rotate * -1
    //                 const decalageCircle=10

    //                 items.push(
    //                     <li
    //                         key={i}
    //                         style={{
    //                             'transform': 'rotate(' + rotate + 'deg) translate(' + radius + 'px) rotate(' + rotateReverse + 'deg) translate(' + -radius / 2 + 'px) translateY('+decalageCircle+'px)',
    //                             "backgroundColor": i + 1 == tour ? "#BF0000" : null
    //                         }}

    //                     >
    //                         {i + 1}
    //                     </li>

    //                 )
    //             }
    //             return items
    //         }

    //         return (
    //             <div
    //                 className="case-panel"
    //                 style={{
    //                     flex: 1
    //                 }}
    //             >
    //                 <label
    //                     className="label-title"
    //                 >
    //                     {getText("tourParTour")}
    //                 </label>
    //                 <ul >
    //                     {renderCircleItems()}
    //                 </ul>
    //             </div>
    //         )
    //     }

    //     const renderFeu = () => {
    //         return (
    //             <div
    //                 className="case-panel"
    //                 style={{
    //                     flex: 1
    //                 }}
    //             >
    //                 <label
    //                     className="label-title"
    //                 >
    //                     {getText("play")}
    //                 </label>

    //                 <div className="donnees-container">
    //                     <div className='feu'>
    //                         <div style={{ backgroundColor: numeroPompier != tour || chrono < 30 ? chrono <= 30  ? "#ff0000" : "#4dff4d" : "#9F9F9F" }}></div>
    //                         <div
    //                             className={chrono <= 30 && chrono>0? "clignotant" : ""}
    //                             style={{ backgroundColor: numeroPompier == tour ? chrono <= 30 ? chrono>0 ? "#E26F00" :  "#ff0000" : "#4dff4d" : "#9F9F9F" }}
    //                         ></div>
    //                     </div>
    //                     <span className="case-value" style={{
    //                         marginTop: "10%",
    //                         width: "100%",
    //                         maxWidth: "100%"
    //                     }} >
    //                         {(Math.floor(chrono / 60)).toString().padStart(2, "0") + " : "}
    //                         <span style={{ color: chrono <= 30 ? "red" : "inherit", marginLeft: 5 }}> {" " + (chrono % 60).toString().padStart(2, "0")} </span>
    //                     </span>
    //                 </div>





    //             </div>
    //         )
    //     }

 



    const renderDisconnect = () => {
        return (
            <div
                className="btn-panel-droite"
                style={{
                    flex: 1
                }}
            >

                {developpe ?

                    <Button
                        variant="contained"
                        color="primary"
                        // className={classes.button}
                        onClick={()=>{
                            setDeveloppe(false)
                            handleDisconnect()
                        }}
                        startIcon={
                            <ExitToAppOutlinedIcon
                                fontSize="large"
                            />}
                    >
                        Se déconnecter
                    </Button>
                    :
                    // <IconButton aria-label="delete" variant="contained"
                    //     color="primary">
                    <div>
                        <ExitToAppOutlinedIcon
                            fontSize="small"
                            // color="primary"
                        />
                        </div>
                    // </IconButton>
                }

            </div>
        )
    }

    const renderMessage = () => {
        return (
            <div
                className="btn-panel-droite"
                style={{
                    flex: 1
                }}
            >

                {developpe ?

                    <Button
                        variant="contained"
                        color="primary"
                        disabled={true}
                        startIcon={
                            <ChatOutlinedIcon
                                fontSize="large"
                            />}
                    >
                        Messagerie
                    </Button>
                    :
                    <div>
                        <ChatOutlinedIcon
                            fontSize="small"
                            // color="gray"
                        />
                        </div>
                    // </IconButton>
                }

            </div>
        )
    }

    return (
        configuration != null ?
            <div className="bandeau-droite-inter"
                onMouseEnter={() => setDeveloppe(true)}
                onMouseLeave={() => setDeveloppe(false)}
            >
                {renderDisconnect()}
                {renderMessage()}
            </div>
            :
            null

    );
}

export default InterBandeauDroite;