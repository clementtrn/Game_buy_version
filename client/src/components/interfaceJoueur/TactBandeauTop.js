import React, { useState, useEffect } from 'react'
import CaseDonnee from './panels/CaseDonnee'
import "../../styles/TactBandeauTop.css"
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PlayAPI from "../../API/PlayAPI"
import ContentsAPI from "../../API/ContentsAPI"

const TactBandeauTop = ({
    numeroPompier,
    sequence,
    numEquipe,
    numSession,
    cycle,
    tour,
    pomp,
    stocks,
    resultats,
    configuration,
    budget,
    equipe,
    handleClicValidated,
    play,
    chronoInit,
    budgetDepense

}) => {
    const [textes, setTextes] = useState(null)
    const [chrono, setChrono] = useState(null)
    useEffect(() => {
        
        if (pomp == numeroPompier && chrono !== null && play && chrono>=0) {
            if (chrono > 0) {
                var chronoTimer = setInterval(() => {
                    if (chrono % 30 == 0 && chrono>10) PlayAPI.updateCurrentChrono(chrono, numSession, numEquipe)
                    setChrono(chrono => chrono - 1)
                    

                }, 1000)

            } else {
                // clearInterval(chronoTimer)
                // console.log("handle")
                if(chrono==0){
                    handleClicValidated(true)
                    setChrono(-1)
                }
                
            }
           
        } else {
            if (configuration !== null ) {
                if(chronoInit==null || chrono==-1){
                    setChrono(-1)
                }else{
                    setChrono(chronoInit)
                }
                 
            }
        }

        return () => {
            clearInterval(chronoTimer)
        }
    }, [chrono])

    useEffect(()=>{
        if(chronoInit!==null && (chrono>=chronoInit || chrono==-1)   && configuration!==null){
          setChrono(chronoInit)
        }
      })


    

    // useEffect(() => {
    //     // console.log(configuration.chronoTour.valeur)
    //     if (chrono === null && configuration !== null) {
    //         // setChrono(chronoInit)
    //     }
    // })


    useEffect(() => {
        // console.log("use effect")
        const getTextes = async () => {
            const textes = ContentsAPI.getTexts("jeuTactBandeauTop").then(
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
                return textes["label" + name.charAt(0).toUpperCase() + name.slice(1)].contenu
            } catch (error) {
                console.log("label" + name.charAt(0).toUpperCase() + name.slice(1))
                return name
            }
        }
    }



    const renderStocks = () => {
        return (
            <div
                className="case-panel donnees-container"
                style={{
                    flex: 3
                }}
            >
                <label
                    className="label-title"
                >
                    {getText("stockEquipements")}
                </label>
                <div className="sous-donnees-container">
                    <CaseDonnee
                        key={0}
                        name={"nbExtFeu"}
                        value={stocks.Feu}
                        primary={false}
                        flexFactor={1}
                        textes={textes}

                    />
                    <CaseDonnee
                        key={1}
                        name={"nbExtFum"}
                        value={stocks.Fum}
                        primary={false}
                        flexFactor={1}
                        textes={textes}

                    />
                </div>
                <div className="sous-donnees-container">
                    <CaseDonnee
                        key={2}
                        name={"nbExtFeuFum"}
                        value={stocks.FeuFum}
                        primary={false}
                        flexFactor={2}
                        textes={textes}

                    />
                    <CaseDonnee
                        key={3}
                        name={"nbMarqueurs"}
                        value={stocks.Marqueur}
                        primary={false}
                        flexFactor={2}
                        textes={textes}

                    />
                </div>
            </div>
        )
    }

    const renderResults = () => {
        return (
            <div
                className="case-panel donnees-container"
                style={{
                    flex: 2
                }}
            >
                <label
                    className="label-title"
                >
                    {getText("resultats") + " " + equipe}
                </label>
                <CaseDonnee
                    key={4}
                    name={getText("nbDecedes")}
                    value={resultats.Decedes}
                    primary={false}
                    flexFactor={0}
                />
                <CaseDonnee
                    key={5}
                    name={getText("nbSauves")}
                    value={resultats.Sauves}
                    primary={false}
                    flexFactor={0}
                />
            </div>
        )
    }

    const renderNumPompier = () => {
        return (
            <div
                className="case-panel"
                style={{
                    flex: 1
                }}
            >
                <label
                    className="label-title"
                >
                    {getText("numPompier")}
                </label>
                <div className="donnees-container">
                    <label
                        className="label-title label-num-pompier"
                    >
                        {numeroPompier}
                    </label>
                    <BookmarkRoundedIcon
                        className="icone-num-pompier"
                        fontSize="large"
                        stroke={"white"}
                        strokeWidth={1}
                    />
                </div>
            </div>
        )
    }

    const renderCircleTours = () => {
        var type = 1, //circle type - 1 whole, 0.5 half, 0.25 quarter
            radius = 20, //distance from center
            start = -90, //shift start from 0
            // $elements = $('li:not(:first-child)'),
            numberOfElements = configuration.nbPompEquipe.valeur,
            slice = 360 * type / numberOfElements;

        const renderCircleItems = () => {
            var items = []
            const decalage = 1.2
            // items.push(
            //     <li
            //         key={"c"}
            //         style={{
            //             'transform': 'translate(' + (-radius*decalage*2) + 'px,'+ (-radius*decalage) +'px)',
            //             "backgroundColor": tour==-1 ? "#BF0000" : null
            //         }}

            //     >
            //         {"C"}
            //     </li>
            // )
            items.push(
                <li
                    key={"s"}
                    style={{
                        'transform': 'translate(' + (radius * decalage) + 'px,' + (-radius * decalage) + 'px)',
                        "backgroundColor": pomp == 0 ? "#BF0000" : null
                    }}

                >
                    {"S"}
                </li>
            )

            for (let i = 0; i < numberOfElements; i++) {
                const rotate = slice * i + start
                const rotateReverse = rotate * -1
                const decalageCircle = 10

                items.push(
                    <li
                        key={i}
                        style={{
                            'transform': 'rotate(' + rotate + 'deg) translate(' + radius + 'px) rotate(' + rotateReverse + 'deg) translate(' + -radius / 2 + 'px) translateY(' + decalageCircle + 'px)',
                            "backgroundColor": i + 1 == pomp ? "#BF0000" : null
                        }}

                    >
                        {i + 1}
                    </li>

                )
            }
            return items
        }

        return (
            <div
                className="case-panel"
                style={{
                    flex: 1
                }}
            >
                <label
                    className="label-title"
                >
                    {getText("tourParTour")}
                </label>
                <ul >
                    {renderCircleItems()}
                </ul>
            </div>
        )
    }

    const renderFeu = () => {
        return (
            <div
                className="case-panel"
                style={{
                    flex: 1
                }}
            >
                <label
                    className="label-title"
                >
                    {getText("play")}
                </label>

                <div className="donnees-container">
                    <div className='feu'>
                        <div
                            className={chrono < 30 && chrono>0? "clignotant animation-reverted" : ""}
                            style={{ backgroundColor: numeroPompier != pomp ? "#ff0000" : chrono>=0 && chrono < 30 ? "#E26F00" : "#9F9F9F"  }}></div>
                        <div
                            className={chrono < 30 && chrono>0 ? "clignotant" : ""}
                            style={{ backgroundColor: numeroPompier == pomp ? chrono>=0 && chrono < 30 ? "#E26F00" : "#4dff4d" : "#9F9F9F" }}
                        ></div>
                    </div>
                    <span className="case-value" style={{
                        marginTop: "10%",
                        width: "100%",
                        maxWidth: "100%"
                    }} >
                        {(Math.floor((chrono>=0 ? chrono : configuration.chronoTourTact.valeur)/ 60)).toString().padStart(2, "0") + " : "}
                        <span style={{ color: chrono <= 30 && chrono>0? "red" : "inherit", marginLeft: 5 }}> {" " + ((chrono>=0 ? chrono : configuration.chronoTourTact.valeur) % 60).toString().padStart(2, "0")} </span>
                    </span>
                </div>



            </div>
        )
    }


    return (
        configuration != null ?
            <div className="bandeau-top">
                <div className="cases-container">
                    <CaseDonnee
                        name={"sequence"}
                        value={sequence}
                        primary={true}
                        flexFactor={1}
                        textes={textes}
                        data={configuration.nbSequences.valeur}
                    />
                    <CaseDonnee
                        name={"cycle"}
                        value={cycle}
                        primary={true}
                        flexFactor={1}
                        textes={textes}
                        data={configuration.nbCyclesParSequence.valeur}
                    />
                    <CaseDonnee
                        name={"tour"}
                        value={tour}
                        primary={true}
                        flexFactor={1}
                        textes={textes}
                        data={configuration.nbToursParCycle.valeur}
                    />
                    <CaseDonnee
                        name={"budgetRestant"}
                        value={budget + " €"}
                        primary={true}
                        flexFactor={1}
                        textes={textes}
                        data={budgetDepense >= configuration.budgetTourMax.valeur}

                    />
                    {renderStocks()}
                    {renderResults()}
                    {renderCircleTours()}
                    {renderNumPompier()}
                    {renderFeu()}

                </div>

            </div>


            :
            null


    );
}

export default TactBandeauTop;