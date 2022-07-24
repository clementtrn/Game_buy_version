import React, { useState, useEffect } from 'react'
import '../../styles/InterBandeauBottom.css';
import CaseDonnee from './panels/CaseDonnee'
import Button from '@material-ui/core/Button'
import ContentsAPI from "../../API/ContentsAPI"


const InterBandeauBottom = ({
    numeroPompier,
    vue,
    resultats,
    budget,
    validated,
    handleClicValidated,
    tour,
    currentCycle,
    couts,
    equipe,
    pomp
}) => {
  
    const [textes, setTextes] = useState(null)

    useEffect(() => {
        const getTextes = async () => {
            const textes = ContentsAPI.getTexts("jeuInterBandeauBottom").then(
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
                return name
            }
        }
    }

    


    const renderCoutsInterventions = (interventions) => {
        if(couts!==null){
            var components1 = []
            var components2 = []
            var components = []
            if(interventions){
                Object.keys(couts.interventions).forEach((key,index) => {
                    if(index<Object.keys(couts.interventions).length/2){
                        components1.push(
                            <span key={index} className="label-cout-inter">
                                {getText(key) + " : "}<span className="label-cout-inter-eur">{couts.interventions[key] + " €"}</span>
                            </span>
                        )
                    }else{
                        components2.push(
                            <span key={index} className="label-cout-inter">
                                {getText(key) + " : "}<span className="label-cout-inter-eur">{couts.interventions[key] + " €"}</span>
                            </span>
                        )
                    }
                    
                });
            }else{
                Object.keys(couts.equipements).forEach((key,index) => {
                    if(index<Object.keys(couts.equipements).length/2){
                        components1.push(
                            <span key={index} className="label-cout-inter">
                                {getText(key) + " : "}<span className="label-cout-inter-eur">{couts.equipements[key] + " €"}</span>
                            </span>
                        )
                    }else{
                        components2.push(
                            <span key={index} className="label-cout-inter">
                                {getText(key) + " : "}<span className="label-cout-inter-eur">{couts.equipements[key] + " €"}</span>
                            </span>
                        )
                    }
                });
            }
            
            return (
                <div className="case-panel">
                    <label
                        className="label-title"
                    >
                        {"Coûts "+vue.charAt(0).toUpperCase() + vue.slice(1)}
                    </label>
                    <div className="couts-container">
                        <div>
                            {components1}
                        </div>
                        <div>
                            {components2}
                        </div>
                    </div>
                </div>
               
            )
        }
       
    }

    const renderBudgets = () => {
        return (
            <div className="budgets-container">
                <div
                    className="case-panel donnees-container "
                    style={{
                        flex: 1
                    }}
                >
                    <label
                        className="label-title"
                    >
                        {vue == "interventions"? getText("sequenceInter") : getText("sequenceEq")}
                    </label>
                    <CaseDonnee
                        key={1}
                        name={"budgetSeqTot"}
                        value={budget!=undefined ? budget.sequence : 0+" €"}
                        primary={false}
                        textes={textes}
                        flexFactor={0}
                    />
                    <CaseDonnee
                        key={2}
                        name={"budgetSeqDep"}
                        value={budget!=undefined ? budget.depense : 0+" €"}
                        primary={false}
                        textes={textes}
                        flexFactor={0}
                    />
                    <CaseDonnee
                        key={3}
                        name={"budgetSeqDispo"}
                        value={budget!=undefined ? budget.sequence-budget.depense : 0+" €"}
                        primary={false}
                        textes={textes}
                        flexFactor={0}
                    />
                </div>
                {/* <div
                    className="case-panel donnees-container "
                    style={{
                        flex: 1
                    }}
                >
                    <label
                        className="label-title"
                    >
                        {"Cycle en cours"}
                    </label>
                    <CaseDonnee
                        key={1}
                        name={"budgetCycleTot"}
                        value={budget.cycle.total+" €"}
                        primary={false}
                        textes={textes}
                        flexFactor={0}
                    />
                    <CaseDonnee
                        key={2}
                        name={"budgetCycleDep"}
                        value={budget.cycle.depense+" €"}
                        primary={false}
                        textes={textes}
                        flexFactor={0}
                    />
                    <CaseDonnee
                        key={3}
                        name={"budgetCycleDispo"}
                        value={budget.cycle.total-budget.cycle.depense+" €"}
                        primary={false}
                        textes={textes}
                        flexFactor={0}
                    />
                    
                </div> */}
            </div>

        )
    }


    const renderBoutonsValider = () => {
        return (
            <div className="boutons-valider-container">
                <Button
                    disabled={numeroPompier !== pomp || (vue=="interventions" ? validated.interventions : validated.equipements)}
                    key={0}
                    className="bouton-valider vert"
                    variant='contained'
                    disableElevation
                    onClick={() => handleClicValidated(vue,true)}

                >
                    <img src={"assets/validate.png"} alt={"image"} />

                </Button>

                <Button
                    disabled={numeroPompier !== pomp || (vue=="interventions" ? !(validated.interventions && !validated.equipements) : !(!validated.interventions && validated.equipements))}
                    key={1}
                    className="bouton-valider rouge"
                    variant='contained'
                    disableElevation
                    onClick={() => handleClicValidated(vue,false)}
                >
                    <img src={"assets/return.png"} alt={"image"} />
                </Button>

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
                    {getText("resultats") + " N°" + equipe}
                </label>
                <CaseDonnee
                    key={1}
                    name={getText("nbDecedes")}
                    value={resultats.Decedes}
                    primary={false}
                    flexFactor={0}
                />
                <CaseDonnee
                    key={2}
                    name={getText("nbSauves")}
                    value={resultats.Sauves}
                    primary={false}
                    flexFactor={0}
                />
                <CaseDonnee
                    key={3}
                    name={getText("nbMarqueurs")}
                    value={resultats.Marqueur}
                    primary={false}
                    flexFactor={0}
                />
            </div>
        )
    }
    return (
        <>
           { vue=="operations"? 
                <div className="bandeau-bottom-inter left">
                    {renderResults()}
                </div>
            : null}
             { vue=="interventions"? 
                <div className="bandeau-bottom-inter">
                {renderCoutsInterventions(true)}
                {renderBudgets()}
                {renderBoutonsValider()}
            </div>
            : null}
             { vue=="equipements"? 
                <div className="bandeau-bottom-inter">
                {renderCoutsInterventions(false)}
                {renderBudgets()}
                {renderBoutonsValider()}
            </div>
            : null}
            
        </>
    );
}

export default InterBandeauBottom;