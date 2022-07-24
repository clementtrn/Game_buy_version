import React, { useState, useEffect,useRef } from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton';
import "../../../styles/TactBandeauBottom.css"
import Bulle from './Bulle';

const BoutonAction = ({
    action,
    nbIntervention,
    nbStock,
    sourceImage,
    handleClicAction,
    selected,
    num,
    disabled,
    texteBulle,
    coutInter,
    coutEq
}) => {
    
    const [bulleOpen,setBulleOpen]=useState(null)
    let timerOver
    const handleOpen = () => {
        // console.log(selected,num)

        // if(!selected){
            setBulleOpen(true)
        // }
        // console.log("open")
    };

    const handleClose = () => {
        setBulleOpen(false)
        clearTimeout(timerOver)
        // console.log("close")
    };

    
    const handleOver=(delay)=>{
        // console.log(selected)
        timerOver=setTimeout(() => {
            handleOpen()
        }, delay);
    }




    return (
        <div
        onMouseEnter={() => {
            handleOver(bulleOpen===null ? 4000 : 5000)
        }}
        onMouseLeave={() => {
            clearTimeout(timerOver)
        }}
        >
            <ToggleButton
                disabled={disabled || nbIntervention <= 0 || nbStock <= 0}
                selected={selected && ![4, 5].includes(num)}
                className="bouton-action"
                variant='contained'
                value={num}
                onClick={() => {
                    clearTimeout(timerOver)
                    handleClicAction(num)
                }}
               

            >
                {/* <div> */}



                <label className="title-action">{action + "\n"}</label>
                <img src={sourceImage} alt={"image"} />
                {nbIntervention > 1 ?
                    <label className="count-action">{nbIntervention + " interventions"}</label>

                    :

                    <label className="count-action">{nbIntervention + " intervention"}</label>
                }
                {/* </div> */}

            </ToggleButton>

            <Bulle
                open={bulleOpen}
                handleClose={handleClose}
                texte={texteBulle}
                sourceImage={sourceImage}
                action={action}
                coutInter={coutInter}
                coutEq={coutEq}
            />
        </div>
    );
}

export default BoutonAction;