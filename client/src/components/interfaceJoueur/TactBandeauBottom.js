import React, { useState, useEffect } from 'react'
import "../../styles/TactBandeauBottom.css"
import BoutonAction from "./panels/BoutonAction"
import ForwardIcon from '@material-ui/icons/Forward';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button'

import { CSSTransitionGroup } from "react-transition-group"
import ContentsAPI from "../../API/ContentsAPI"
import Bulle from './panels/Bulle';

const TactBandeauBottom = ({
    interventions,
    stocks,
    numeroPompier,
    handleClicFleche,
    handleClicValidated,
    handleClicDoor,
    handleClicMarqueur,
    handleClicExt,
    handleNoClicked,
    handleClicHabitant,
    btnClickedBottom,
    mursAutour,
    casesAutour,
    currentCase,
    histActions,
    configuration,
    pomp,
    deplacementEnCours,
    budgetMaxAtteint,
    isLoading

}) => {
    // console.log(histActions)
    const [textes, setTextes] = useState(null)
    const mursInterdits = [1, 2, 3, 5]
    // console.log(casesAutour)
    useEffect(() => {
        const getTextes = async () => {
            const textes = ContentsAPI.getTexts("jeuTactBandeauBottom").then(
                (res) => { setTextes(res) }
            )
        }
        if (textes == null) {
            getTextes()
        }
    }, [textes])


    const handleClicAction = (num) => {
        if (num == null) {
            handleNoClicked()
        } else {
            if (num == 4 || num == 5) handleClicDoor(num == 4)
            if (num == 3) handleClicMarqueur()
            if (num < 3) handleClicExt(num)
            if (num == 6) handleClicHabitant()
        }


    }
    const [bulleOpenFleches, setBulleOpenFleches] = useState(false)

    const renderFleches = () => {
        let timerOverFleches
        const handleOpenFleches = () => {
            setBulleOpenFleches(true)
        };

        const handleCloseFleches = () => {
            setBulleOpenFleches(false)
            clearTimeout(timerOverFleches)
        };


        const handleOverFleches = (delay) => {
            timerOverFleches = setTimeout(() => {
                handleOpenFleches()
            }, delay);
        }

        const disabled = interventions.Deplacement <= 0 || budgetMaxAtteint || isLoading || numeroPompier!=pomp
        const color = "#4A4848"
        const colorDisabled = "#BFBFBF"
        if (configuration !== null) {
            return (
                <div
                    className="fleches-container"
                    onMouseEnter={() => {
                        handleOverFleches(bulleOpenFleches === null ? 1500 : 3000)
                    }}
                    onMouseLeave={() => {
                        clearTimeout(timerOverFleches)
                    }}
                >
                    <IconButton
                        key={0}
                        className="fleche-up fleche"
                        onClick={() => {
                            handleClicFleche(0)
                            clearTimeout(timerOverFleches)
                        }}
                        disabled={disabled || mursInterdits.includes(mursAutour[0]) || casesAutour.dessus > 0 || casesAutour.dessus === undefined || deplacementEnCours.type > 0}
                    >
                        <ForwardIcon
                            style={{ color: disabled || mursInterdits.includes(mursAutour[0]) || casesAutour.dessus > 0 || casesAutour.dessus === undefined ? colorDisabled : color }}
                            stroke={"white"}
                            strokeWidth={1}
                        />
                    </IconButton>
                    <IconButton
                        key={1}
                        className="fleche-droite fleche"
                        onClick={() => {
                            handleClicFleche(1)
                            clearTimeout(timerOverFleches)
                        }}
                        disabled={disabled || mursInterdits.includes(mursAutour[1]) || casesAutour.droite > 0 || casesAutour.droite === undefined || deplacementEnCours.type > 0}
                    >
                        <ForwardIcon
                            // style={{ color: "#4A4848" }}
                            style={{ color: disabled || mursInterdits.includes(mursAutour[1]) || casesAutour.droite > 0 || casesAutour.droite === undefined ? colorDisabled : color }}
                            stroke={"white"}
                            strokeWidth={1}
                        />
                    </IconButton>
                    <div className="fleche-center fleche">
                        <div className="circle-fleche"></div>
                    </div>
                    <IconButton
                        key={2}
                        className="fleche-bottom fleche"
                        onClick={() => {
                            handleClicFleche(2)
                            clearTimeout(timerOverFleches)
                        }}
                        disabled={disabled || mursInterdits.includes(mursAutour[2]) || casesAutour.dessous > 0 || casesAutour.dessous === undefined || deplacementEnCours.type > 0}

                    >
                        <ForwardIcon
                            style={{ color: disabled || mursInterdits.includes(mursAutour[2]) || casesAutour.dessous > 0 || casesAutour.dessous === undefined ? colorDisabled : color }}
                            stroke={"white"}
                            strokeWidth={1}
                        />
                    </IconButton>
                    <IconButton
                        key={3}
                        className="fleche-gauche fleche"
                        onClick={() => {
                            handleClicFleche(3)
                            clearTimeout(timerOverFleches)
                        }}
                        disabled={disabled || mursInterdits.includes(mursAutour[3]) || casesAutour.gauche > 0 || casesAutour.gauche === undefined || deplacementEnCours.type > 0}
                    >
                        <ForwardIcon
                            style={{ color: disabled || mursInterdits.includes(mursAutour[3]) || casesAutour.gauche > 0 || casesAutour.gauche === undefined ? colorDisabled : color }}
                            stroke={"white"}
                            strokeWidth={1}
                        />
                    </IconButton>
                    <Bulle
                        open={bulleOpenFleches}
                        handleClose={handleCloseFleches}
                        texte={textes !== null ? textes["bulleFleches"].contenu : ""}
                        sourceImage={"assets/fleches.png"}
                        action={"Se déplacer"}
                        coutInter={configuration["coutInterDeplacement"] !== undefined ? configuration["coutInterDeplacement"].valeur : 0}
                        coutEq={configuration["coutEqDeplacement"] !== undefined ? configuration["coutInterDeplacement"].valeur : 0}
                    />
                </div>
            )
        }



    }



    const renderButtons = () => {
        var boutons = []
        const indexMurs=["dessus","droite","dessous","gauche"]
        if (textes != null && configuration !== null) {
            Object.keys(textes).forEach((label, index) => {
                if (label.includes("label")) {
                    var disabled = true

                    
                    
                    if (index < 2 && mursAutour.some((mur, index) => casesAutour[indexMurs[index]] !==null && casesAutour[indexMurs[index]] !==undefined && casesAutour[indexMurs[index]]==4 && !mursInterdits.includes(mur))) disabled = false // une case en feu autour + extincteur feu
                    if (index == 2 && mursAutour.some((mur, index) => casesAutour[indexMurs[index]] !==null && casesAutour[indexMurs[index]] !==undefined && casesAutour[indexMurs[index]]==3 && !mursInterdits.includes(mur))) disabled = false // une case en fumée autour + extincteur fumée

                    if (index == 6 && mursAutour.some((mur, index) => casesAutour[indexMurs[index]] !==null && casesAutour[indexMurs[index]] !==undefined && Math.floor(casesAutour[indexMurs[index]] / 10) == 2 && !mursInterdits.includes(mur)) && Math.floor(currentCase / 1000) == 1 && (currentCase% 100 - currentCase % 10)==0 ) disabled = false // une case habitant + transport + pompier non chargé
                    if (index == 3 && mursAutour.some(el => el > 0 && (el != 4 && el != 2))) disabled = false // marqueur degats 
                    if (index == 4 && mursAutour.includes(5)) disabled = false // porte fermee


                    if (index == 5 && mursAutour.includes(6)) disabled = false // porte ouverte
                    
                    if (index != 4 && index != 5 || (index == 4 && mursAutour.includes(5)) || (index == 5 && mursAutour.includes(6))) {

                        boutons.push(
                            <BoutonAction

                                key={label}
                                action={textes[label].contenu}
                                nbIntervention={interventions[label.replace("labelAction", "").replace("Ouvrir", "").replace("Fermer", "")]}
                                nbStock={stocks[label.replace("labelAction", "nb").replace("Ouvrir", "").replace("Fermer", "")]}
                                sourceImage={"assets/" + label.replace("label", "") + ".png"}
                                handleClicAction={handleClicAction}
                                selected={btnClickedBottom == index}
                                num={index}
                                disabled={disabled || deplacementEnCours.type > 0 || budgetMaxAtteint || isLoading || numeroPompier!=pomp}
                                texteBulle={textes[label.replace("label", "bulle").replace("Ouvrir", "").replace("Fermer", "")] !== undefined ? textes[label.replace("label", "bulle").replace("Ouvrir", "").replace("Fermer", "")].contenu : label.replace("label", "bulle")}
                                coutInter={configuration[label.replace("labelAction", "coutInter").replace("Ouvrir", "").replace("Fermer", "")] !== undefined ? configuration[label.replace("labelAction", "coutInter").replace("Ouvrir", "").replace("Fermer", "")].valeur : 0}
                                coutEq={configuration[label.replace("labelAction", "coutEq").replace("Ouvrir", "").replace("Fermer", "")] !== undefined ? configuration[label.replace("labelAction", "coutEq").replace("Ouvrir", "").replace("Fermer", "")].valeur : 0}

                            />
                        )
                    }

                }

            });
        }
        return (
            <div className="boutons-container">
                {boutons}
            </div>
        )
    }
    const [bulleOpenValider, setBulleOpenValider] = useState(null)
    const [bulleOpenRetour, setBulleOpenRetour] = useState(null)

    const renderBoutonsValider = () => {
        let timerOverValider
        const handleOpenValider = () => {
            setBulleOpenValider(true)
            // console.log("open")
        };

        const handleCloseValider = () => {
            setBulleOpenValider(false)
            clearTimeout(timerOverValider)
            // console.log("close")
        };


        const handleOverValider = (delay) => {
            timerOverValider = setTimeout(() => {
                handleOpenValider()
            }, delay);
        }
        let timerOverRetour
        const handleOpenRetour = () => {
            setBulleOpenRetour(true)
            // console.log("open")
        };

        const handleCloseRetour = () => {
            setBulleOpenRetour(false)
            clearTimeout(timerOverRetour)
            // console.log("close")
        };


        const handleOverRetour = (delay) => {
            timerOverRetour = setTimeout(() => {
                handleOpenRetour()
            }, delay);
        }
        
        // console.log(deplacementEnCours.type > 0,isLoading)
        return (
            <div className="boutons-valider-container">
                <div
                    onMouseEnter={() => {
                        handleOverValider(bulleOpenValider === null ? 1500 : 3000)
                    }}
                    onMouseLeave={() => {
                        clearTimeout(timerOverValider)
                    }}
                >
                    <Button
                        disabled={numeroPompier != pomp || deplacementEnCours.type > 0 || isLoading}
                        key={0}
                        className="bouton-valider vert"
                        variant='contained'
                        disableElevation
                        onClick={() => {
                            clearTimeout(timerOverValider)
                            handleClicValidated(true)
                        }}

                    >
                        <img src={"assets/validate.png"} alt={"image"} />

                    </Button>
                    <Bulle
                        open={bulleOpenValider}
                        handleClose={handleCloseValider}
                        texte={textes !== null ? textes["bulleValider"].contenu : ""}
                        sourceImage={"assets/validate-vert.png"}
                        action={"Valider vos actions"}
                        coutInter={null}
                        coutEq={null}
                    />
                </div>
                <div
                    onMouseEnter={() => {
                        handleOverRetour(bulleOpenRetour === null ? 1500 : 3000)
                    }}
                    onMouseLeave={() => {
                        clearTimeout(timerOverRetour)
                    }}
                >
                    <Button
                        disabled={histActions.length <= 1 || deplacementEnCours.type > 0 || isLoading || numeroPompier!=pomp }
                        key={1}
                        className="bouton-valider rouge"
                        variant='contained'
                        disableElevation
                        onClick={() => {
                            handleClicValidated(false)
                            clearTimeout(timerOverRetour)
                        }}
                    >
                        <img src={"assets/return.png"} alt={"image"} />
                    </Button>
                    <Bulle
                        open={bulleOpenRetour}
                        handleClose={handleCloseRetour}
                        texte={textes !== null ? textes["bulleRetour"].contenu : ""}
                        sourceImage={"assets/return-rouge.png"}
                        action={"Annuler une action"}
                        coutInter={null}
                        coutEq={null}
                    />
                </div>
            </div>
        )

    }
    return (
        <div className="bandeau-bottom-tact">

            {renderFleches()}

            {renderButtons()}

            {renderBoutonsValider()}

        </div>


    );
}

export default TactBandeauBottom;