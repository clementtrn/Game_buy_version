import React, { useState, useEffect } from 'react'
import CaseDonnee from './panels/CaseDonnee'
import "../../styles/InterBandeauTop.css"
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

import PlayAPI from "../../API/PlayAPI"
import ContentsAPI from "../../API/ContentsAPI"

const InterBandeauTop = ({
    numeroPompier,
    numEquipe,
    numSession,
    sequence,
    cycle,
    tour,
    configuration,
    handleViewChange,
    vue,
    interventionsValidated,
    equipementsValidated,
    pomp,
    play,
    handleClicValidated,
    chronoInit,
    validated
}) => {
    const [textes, setTextes] = useState(null)
    // console.log(chronoInit)
    useEffect(() => {
        const getTextes = async () => {
            const textes = ContentsAPI.getTexts("jeuInterBandeauTop").then(
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
                return textes["label" + name.charAt(0).toUpperCase() + name.slice(1)].contenu
            } catch (error) {
                // console.log("label" + name.charAt(0).toUpperCase() + name.slice(1))
                return name
            }
        }
    }

    const [chrono, setChrono] = useState(null)
    // useEffect(()=>{
    //     console.log(chrono)
    // },[chrono])
    useEffect(() => {
        
        if (pomp == numeroPompier && chrono !== null && play) {
            if (chrono > 0) {
                var chronoTimer = setInterval(() => {
                    if (chrono % 30 == 0 && chrono>10) PlayAPI.updateCurrentChrono(chrono, numSession, numEquipe)
                    setChrono(chrono => chrono - 1)
                    

                }, 1000)

            } else {
                // clearInterval(chronoTimer)
                // console.log("handle")
                if(!validated.interventions ) handleClicValidated("interventions",true)
                if(!validated.equipements) handleClicValidated("equipements",true)
                
                
                setChrono(null)
            }
           
        } else {
            if (configuration !== null ) {
                if(chronoInit==null){
                    // console.log(chronoInit)
                    setChrono(configuration.chronoTourInter.valeur)
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
    if(chronoInit!==null && chrono>=chronoInit && configuration!==null){
      setChrono(chronoInit)
    }
  })




    const renderNumEquipe = () => {
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
                    {getText("numEquipe")}
                </label>
                <div className="donnees-container">
                    <label
                        className="label-title label-num-pompier"
                    >
                        {numEquipe}
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
                        'transform': 'translate(' + (radius*decalage) + 'px,'+ (-radius*decalage) +'px)',
                        "backgroundColor": pomp==0 ? "#BF0000" : null
                    }}

                >
                    {"S"}
                </li>
            )

            for (let i = 0; i < numberOfElements; i++) {
                const rotate = slice * i + start
                const rotateReverse = rotate * -1
                const decalageCircle=10

                items.push(
                    <li
                        key={i}
                        style={{
                            'transform': 'rotate(' + rotate + 'deg) translate(' + radius + 'px) rotate(' + rotateReverse + 'deg) translate(' + -radius / 2 + 'px) translateY('+decalageCircle+'px)',
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
                         className={chrono < 30 ? "clignotant animation-reverted" : ""}
                            style={{ backgroundColor: numeroPompier != pomp || chrono<30 ?  chrono<30 ? "#E26F00" : "#ff0000" : "#9F9F9F" }}></div>
                        <div
                            className={chrono < 30 ? "clignotant" : ""}
                            style={{ backgroundColor: numeroPompier == pomp ? chrono < 30 ? "#E26F00" : "#4dff4d" : "#9F9F9F" }}
                        ></div>
                    </div>
                    <span className="case-value" style={{
                        marginTop: "10%",
                        width: "100%",
                        maxWidth: "100%"
                    }} >
                        {(Math.floor(chrono / 60)).toString().padStart(2, "0") + " : "}
                        <span style={{ color: chrono <= 30 ? "red" : "inherit", marginLeft: 5 }}> {" " + (chrono % 60).toString().padStart(2, "0")} </span>
                    </span>
                </div>





            </div>
        )
    }




    return (
        configuration != null ?
            <>
                <div className="bandeau-top-right">

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
                        {/* <CaseDonnee
                        name={"budgetRestant"}
                        value={budget+" €"}
                        primary={true}
                        flexFactor={1}
                        textes={textes}

                    /> */}
                        {renderCircleTours()}
                        {renderNumEquipe()}
                        {renderFeu()}

                    </div>

                </div>


                <div className="bandeau-top-left">
                    <ToggleButtonGroup
                        value={vue}
                        exclusive
                        onChange={handleViewChange}
                        aria-label="text alignment"
                        className='bouton-vue-container'
                    >
                        <ToggleButton value="operations" aria-label="operations" className='bouton-vue'>
                            <Typography
                                className="label-vue"
                                variant="h5" >{textes!==null ? textes["labelOperations"].titre : ""}</Typography>
                            <Typography variant="h6">
                                {textes!==null ? textes["labelOperations"].contenu : ""}
                            </Typography>
                        </ToggleButton>
                        <ToggleButton value="interventions" aria-label="interventions" className='bouton-vue'>
                        <Typography
                                className="label-vue"
                                variant="h5" >{textes!==null ? textes["labelInterventions"].titre : ""}</Typography>
                            <Typography variant="h6">
                                {textes!==null ? textes["labelInterventions"].contenu : ""}
                            </Typography>
                            <div
                                className={interventionsValidated ? "indicateur vert" : "indicateur rouge"}
                            >
                                <img src={
                                    interventionsValidated? "assets/validate.png" : "assets/cancel.png"
                                    } alt={"image"} />
                            </div>
                        </ToggleButton>
                        <ToggleButton value="equipements" aria-label="equipements" className='bouton-vue'>
                        <Typography
                                className="label-vue"
                                variant="h5" >{textes!==null ? textes["labelEquipements"].titre : ""}</Typography>
                            <Typography variant="h6">
                                {textes!==null ? textes["labelEquipements"].contenu : ""}
                            </Typography>
                            <div
                                className={equipementsValidated? "indicateur vert" : "indicateur rouge"}
                            >
                                <img src={
                                    equipementsValidated? "assets/validate.png" : "assets/cancel.png"
                                    } alt={"image"} />
                            </div>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>

            </>


            :
            null


    );
}

export default InterBandeauTop;