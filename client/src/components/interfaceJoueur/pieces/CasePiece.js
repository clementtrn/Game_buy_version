import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import MurPiece from "./MurPiece"

const CasePiece = ({
    murs,
    type,
    coordX,
    coordY,
    nbColonnesPiece,
    nbLignesPiece,
    nbColonnesGrille,
    nbLignesGrille,
    anchor,
    propositionMursDetruire,
    propositionsCase,
    handleClicMur,
    handleClicCase,
    mursH,
    mursV,
    position,
    idPiece,
    deplacementEnCours
}) => {
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    const colorClignotant = "#E26F00"
    const colorCache = "#D1D1D1"
    const colorFondPosition = "white"
    const colorFondPiece = "#EEEEEE"

    const element = useRef()


    const [contentDisplayed,setContentDisplayed]=useState(false)

    useLayoutEffect(() => {
        function updateSize() {
            setHeight(element.current.clientHeight)
            setWidth(element.current.clientWidth)
        }
        setContentDisplayed(true)
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const renderMurs = () => {
        var mursComponents = []
        for (let i = 0; i < 4; i++) {

            mursComponents.push(
                <MurPiece
                    key={i}
                    num={i}
                    height={height}
                    width={width}
                    type={murs[i]}
                    coordX={coordX}
                    coordY={coordY}
                    anchor={anchor}
                    nbColonnesPiece={nbColonnesPiece}
                    nbLignesPiece={nbLignesPiece}
                    nbColonnesGrille={nbColonnesGrille}
                    nbLignesGrille={nbLignesGrille}
                    propositionMursDetruire={propositionMursDetruire}
                    handleClicMur={handleClicMur}
                    mursH={mursH}
                    mursV={mursV}
                />
            )
        }
        return (
            <>
                {mursComponents}
            </>
        )
    }


    const renderContenuCase = () => {
        let opacity = 0
        let source = ""
        var sourceCasque = ""
        var rotate=-90

        
        
        let align="center"
        let justify="center"

        if (Math.floor(type / 1000) == 1) { // POMPIER.
            sourceCasque="assets/Casque"+(type % 1000 - type % 100) / 100+".png"
            if (type % 100 < 10) { // POMPIER SEUL
                opacity = 1
                if(position[0] == coordY && position[1] == coordX){ // CASE DU JOUEUR
                    source = "assets/Pompier0"+(deplacementEnCours!==null && deplacementEnCours!==undefined ? deplacementEnCours.type : "0")+".png"
                }else{
                    source = "assets/Pompier00.png"
                }
                

            } else { // POMPIER HABITANT
                opacity = 1
                source = "assets/PompierHabitant" + (type % 100 - type % 10) / 10 + ".png"
            }

            if(deplacementEnCours!==null && deplacementEnCours!==undefined && position[0] == coordY && position[1] == coordX){
                switch (deplacementEnCours.rotation) {
                    
                    case 1: // HAUT
                        rotate = -90
                        switch (deplacementEnCours.type) {
                            case 1:
                                align="flex-start"
                                break;
                        
                            case 2:
                                align="flex-end"
                                break;
                        }
                        break;
                    case 2: // DROITE
                        rotate = 0
                        switch (deplacementEnCours.type) {
                            case 1:
                                justify="flex-end"
                                break;
                        
                            case 2:
                                justify="flex-start"
                                break;
                        }
                        break;
                    case 3: // BAS
                        rotate = 90
                        switch (deplacementEnCours.type) {
                            case 1:
                                align="flex-end"
                                break;
                        
                            case 2:
                                align="flex-start"
                                break;
                        }
                        break;
                    case 4: // GAUCHE
                        rotate = 180
                        switch (deplacementEnCours.type) {
                            case 1:
                                justify="flex-start"
                                break;
                        
                            case 2:
                                justify="flex-end"
                                break;
                        }
                        break;
                    default:
                        rotate = 0
                        break;
                }
           
    
            }else{
                switch (type%10) {
                    case 1:
                        rotate = -90
                        break;
                    case 2:
                        rotate = 0
                        break;
                    case 3:
                        rotate = 90
                        break;
                    case 4:
                        rotate = 180
                        break;
                    default:
                        rotate=-90
                        break;
                }
            }
            
        } else{
            // console.log(anchor)
            if(position[0] < nbLignesPiece+anchor[0] && position[1]< nbColonnesPiece+anchor[1] ){
                
                // console.log("test2")
                if (Math.floor(type / 10) == 2) {
                    source = "assets/Habitant0.png"
                    if( position!==null && position[0]-1 == coordY && position[1] == coordX && type>20) source = "assets/Habitant"+type%10+".png"// CASE DESSUS
                    if( position!==null && position[0] == coordY && position[1] +1 == coordX && type>20) source = "assets/Habitant"+type%10+".png"// CASE DROITE
                    if( position!==null && position[0]+1 == coordY && position[1] == coordX && type>20) source = "assets/Habitant"+type%10+".png"// CASE DESSOUS
                    if( position!==null && position[0] == coordY && position[1]-1== coordX && type>20) source = "assets/Habitant"+type%10+".png"// CASE GAUCHE
                    opacity = 1
                    rotate=0



                } else if (type == 3) {
                    opacity = 1
                    source = "assets/Fumee.png"
                    rotate=Math.random()*360
                }
                else if (type == 4) {
                    opacity = 1
                    source = "assets/Flamme2.png"
                    rotate=Math.random()*360
                }else{
                    
                    if( position!==null && position[0]-1 == coordY && position[1] == coordX && deplacementEnCours.type==1 && deplacementEnCours.rotation==1) align="flex-end"// CASE DESSUS
                    if( position!==null && position[0] == coordY && position[1] +1 == coordX && deplacementEnCours.type==1 && deplacementEnCours.rotation==2) align="flex-start"// CASE DROITE
                    if( position!==null && position[0]+1 == coordY && position[1] == coordX && deplacementEnCours.type==1 && deplacementEnCours.rotation==3) align="flex-start"// CASE DESSOUS
                    if( position!==null && position[0] == coordY && position[1]-1== coordX && deplacementEnCours.type==1 && deplacementEnCours.rotation==4) align="flex-end"// CASE GAUCHE
            
                    rotate=0
                    
                }
            }

           

            // console.log(source,rotate,opacity)
        } 



        return (
            <div
                style={{
                    position:"absolute",
                    display:"flex",
                    opacity: position[0] == coordY && position[1] == coordX ? opacity : 1,
                    
                    width:"100%",
                    height:"100%",
                    alignItems:align,
                    justifyContent:justify,
                    // zIndex:1
                    
                }}
            >

                
               
                <img
                    style={{
                        // maxHeight: height * 0.9,
                        // maxWidth: width * 0.8,
                        position:"absolute",
                        display:!contentDisplayed && position[0] == coordY && position[1] == coordX ? "none" : "",
                        maxWidth:Math.floor(type / 1000) == 1 && type%100>=10 ? "85%":"90%",
                        height:Math.floor(type / 1000) == 1 && type%100>=10 ? "80%":"90%",
                        objectFit: "contain",
                        transform: rotate !== undefined ? "rotate(" + rotate + "deg)" : "",
                        zIndex:4
                    }}
                    src={source}
                    // onError={(evt)=>{
                    //     setContentDisplayed(false)
                    // }}
                    // onLoad={()=>setContentDisplayed(true)}
                />
                {sourceCasque!=="" ?
                 <img
                 style={{
                     position:"absolute",
                     display:!contentDisplayed && position[0] == coordY && position[1] == coordX ? "none" : "",
                     maxWidth:Math.floor(type / 1000) == 1 && type%100>=10 ? "85%":"90%",
                     height:Math.floor(type / 1000) == 1 && type%100>=10 ? "80%":"90%",
                     objectFit: "contain",
                     transform: rotate !== undefined ? "rotate(" + rotate + "deg)" : "",
                     zIndex:10
                 }}
                 src={sourceCasque}
                 // onError={(evt)=>{
                 //     setContentDisplayed(false)
                 // }}
                 // onLoad={()=>setContentDisplayed(true)}
             />
                :
                null
                } 
            </div>
        )
    }


    const renderCase = () => {
        const source = idPiece!==null && idPiece!==undefined ? "assets/Sol_0"+((idPiece)%6+1)+".png" : null


        return (
            <div 
                style={{
                    display:"flex",
                    flex:1,
                    width: "100%",
                    // height: "100%",
                    justifyContent:"center",
                    alignItems:"center",
                    // zIndex:0
                }}
            >
                {source!==null ? 
                <img
                style={{
                    position:"absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.90) grayscale(5%) contrast(95%)",
                    
                }}
                src={source}
                
            />
            : null}
                
                {renderContenuCase()}
            </div>

        )
    }



    const [clignotant, setClignotant] = useState(false)
    const [valeurApres, setValeurApres] = useState(null)
    const [valeurAvant, setValeurAvant] = useState(null)
    const checkInCoords = () => {
        var checked = false
        if (propositionsCase !== null && propositionsCase !== undefined) {
            var valApres = null
            var valAvant = null
            propositionsCase.forEach((coords) => {
                if (coords[0] == coordY && coords[1] == coordX) {
                    checked = true
                    valAvant = coords[2]
                    valApres = coords[3]
                }
            });

            if (checked && valApres != null) {
                setValeurAvant(valAvant)
                setValeurApres(valApres)
            }
        }

        return checked

    }

    // useEffect(()=>{
    //     console.log(valeurApres)
    // },[valeurApres])



    useEffect(() => {
        setClignotant(checkInCoords())
    })


    return (

        <div

            ref={element}
            className={clignotant ? "clignotant case-piece" : "case-piece"}
            style={{
                backgroundColor: clignotant ? colorClignotant : (type >= 0 ? (position[0] == coordY && position[1] == coordX ? colorFondPosition : colorFondPiece) : colorCache), // -1 caché"
                transition: "2s",
                filter: position[0] == coordY && position[1] == coordX ? "brightness(1.2)" :""
            }}
            onClick={clignotant ? () => handleClicCase(valeurAvant, valeurApres, coordX, coordY)
                : null}
        >
            {renderMurs()}
            {renderCase()}

        </div>

    );
}

export default CasePiece;