import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CasePiece from "./CasePiece"
import { useScrollTrigger } from '@material-ui/core';



const Piece = ({
    carte,
    position,
    nbLignesGrille,
    nbColonnesGrille,
    nbLignesPiece,
    nbColonnesPiece,
    mursV,
    mursH,
    anchor,
    maxLignesPiece,
    maxColonnesPiece,
    propositionMursDetruire,
    handleClicMur,
    handleClicCase,
    propositionsCase,
    anchors,
    deplacementEnCours,
    getAnchor

}) => {
    // console.log("Grille nb lignes : "+nbLignesGrille+", colonnes : "+nbColonnesGrille+" | piece lignes : "+nbLignesPiece+",  colonnes "+nbColonnesPiece+" => anchor i : "+anchor[0]+", j : "+anchor[1])
    // console.log()
    const mursInterdits = [1, 2, 3, 5]

    const [intermediaire,setIntermediaire]=useState(position[0]>=nbLignesGrille && position[1]>=nbColonnesGrille)

    const getTypeExt=(anchori,anchorj)=>{
        if(!intermediaire){
            if(anchori<0 || anchorj<0) return -1
            const mursCote = [mursH[position[0]][position[1]],mursV[position[0]][position[1]+1],mursH[position[0]+1][position[1]],mursV[position[0]][position[1]]]
            // console.log(mursCote)
            if(anchori<carte.length && anchorj<carte[0].length){
                if(anchori==position[0]+1 && anchorj==position[1] && !mursInterdits.includes(mursCote[2])) return carte[anchori][anchorj] // juste dessous
                if(anchori==position[0]-1 && anchorj==position[1] && !mursInterdits.includes(mursCote[0])) return carte[anchori][anchorj] // juste dessus
                if(anchori==position[0] && anchorj==position[1]-1 && !mursInterdits.includes(mursCote[3])) return carte[anchori][anchorj] // juste gauche
                if(anchori==position[0] && anchorj==position[1]+1 && !mursInterdits.includes(mursCote[1])) return carte[anchori][anchorj] // juste droite
        
            }
     
        }
     
        return -1   
    }



    const pompierDansPiece=(anchori,anchorj)=>{
        var present = false
        anchors.forEach(([min,max],index) => {
            if(anchori>=min[0] && anchori<=max[0] && anchorj>=min[1] && anchorj<=max[1]){
                for(let i=min[0];i<=max[0];i++){
                    for(let j=min[1];j<=max[1];j++){
                       
                        if(carte[i][j]>=100){
                            present=true
                        }
                        
                    }
                }
            }
        });
        return present 

    }

    const renderRow=(i)=>{
        var row=[]
        for(let j=0;j<nbColonnesPiece+2;j++){
            const anchori = i+anchor[0]-1
            const anchorj = j+anchor[1]-1
            
            if (anchori<nbLignesPiece+anchor[0] &&  anchori>=anchor[0] && anchorj<nbColonnesPiece+anchor[1] &&  anchorj>=anchor[1] ){

                row.push( 
                    <CasePiece 
                        key={i+","+j}
                        coordX={anchorj}
                        coordY={anchori}
                        anchor={anchor}
                        nbColonnesGrille={nbColonnesGrille}
                        nbLignesGrille={nbLignesGrille}
                        nbColonnesPiece={nbColonnesPiece}
                        nbLignesPiece={nbLignesPiece}
                        murs={[mursH[anchori][anchorj],mursV[anchori][anchorj+1],mursH[anchori+1][anchorj],mursV[anchori][anchorj]]}
                        type={ j>nbColonnesGrille || i>nbLignesGrille || !pompierDansPiece(anchori,anchorj) ? -1 : carte[anchori][anchorj] }
                        propositionMursDetruire={propositionMursDetruire}
                        propositionsCase={propositionsCase}
                        handleClicMur={handleClicMur}
                        handleClicCase={handleClicCase}
                        mursH={mursH}
                        mursV={mursV}
                        position={position}
                        idPiece={getAnchor(anchors,[anchori,anchorj])[1]}
                        deplacementEnCours={deplacementEnCours}
                    />
                )
            }else{
               
                let newI = anchori
                let newJ = anchorj
                var murs =[0,0,0,0]
                
                if(anchori<anchor[0]){ // haut
                    newI = anchori-1
                    newJ = anchorj
                    // console.log("new ",newI,newJ,mursV[newI][newJ+1])
                    try{
                        murs[1]=mursV[anchori][anchorj+1]>0 ? mursV[anchori][anchorj+1] : 0
                    }catch(error){
                    }
                    try{
                        murs[3]=mursV[anchori][anchorj]>0 ? mursV[anchori][anchorj] : 0
                    }catch(error){

                    }
                    try{
                        murs[2]=mursH[anchori+1][anchorj]>0 ? mursH[anchori+1][anchorj] : 0
                    }catch(error){
                    }
                    
                    
                }
                if(anchori>=nbLignesPiece+anchor[0]){ // bas
                    newI = anchori+1
                    newJ = anchorj
                    try{
                        murs[0]=mursH[anchori][anchorj]>0 ? mursH[anchori][anchorj] : 0
                    }catch(error){
                    }
                   
                    try{
                        murs[1]=mursV[anchori][anchorj+1]>0 ? mursV[anchori][anchorj+1] : 0
                    }catch(error){
                    }
                    try{
                        murs[3]=mursV[anchori][anchorj]>0 ? mursV[anchori][anchorj] : 0
                    }catch(error){

                    }
                   
                   
                }
                if(anchorj<anchor[1]){ // gauche
                    newI = anchori
                    newJ = anchorj-1
                    try{
                        murs[0]=mursH[anchori][anchorj]>0 ? mursH[anchori][anchorj] : 0
                    }catch(error){
                    }
                    try{
                        murs[2]=mursH[anchori+1][anchorj]>0 ? mursH[anchori+1][anchorj] : 0
                    }catch(error){
                    }

                    try{
                        murs[1]=mursV[anchori][anchorj+1]>0 ? mursV[anchori][anchorj+1] : 0
                    }catch(error){
                    }
                    
                }
                if(anchorj>=nbColonnesPiece+anchor[1]){ // droite
                    newI = anchori
                    newJ = anchorj+1
                    try{
                        murs[0]=mursH[anchori][anchorj]>0 ? mursH[anchori][anchorj] : 0
                    }catch(error){
                    }
                    try{
                        murs[2]=mursH[anchori+1][anchorj]>0 ? mursH[anchori+1][anchorj] : 0
                    }catch(error){
                    }

                    try{
                        murs[3]=mursV[anchori][anchorj]>0 ? mursV[anchori][anchorj] : 0
                    }catch(error){
                    }
                }

                const typeExt = getTypeExt(anchori,anchorj)

                
                row.push( 
                    <CasePiece 
                        key={i+","+j}
                        coordX={anchorj}
                        coordY={anchori}
                        anchor={anchor}
                        nbColonnesGrille={nbColonnesGrille}
                        nbLignesGrille={nbLignesGrille}
                        nbColonnesPiece={nbColonnesPiece}
                        nbLignesPiece={nbLignesPiece}
                        murs={murs}
                        propositionMursDetruire={propositionMursDetruire}
                        propositionsCase={propositionsCase}
                        handleClicMur={handleClicMur}
                        handleClicCase={handleClicCase}
                        type={typeExt}
                        mursH={mursH}
                        mursV={mursV}
                        position={position}
                        idPiece={typeExt>=0 ? getAnchor(anchors,[anchori,anchorj])[1] : null}
                        deplacementEnCours={deplacementEnCours}
                    /> 
                )
                

            }
            
        }
        return row
    }


    const renderGrille=()=>{
        var grille=[]
        for (let i=0;i<nbLignesPiece+2;i++){
            grille.push(
                <div key={"row"+i} className="row-piece" >
                    {renderRow(i)}
                </div>
            )  
            
        }
        return grille
    }
    
    return (  

    <div
        className="piece"  
        style={{
            position:"absolute",
            width:(nbColonnesPiece+2) /((nbColonnesPiece!=nbColonnesGrille ? maxColonnesPiece :  nbColonnesGrille )+2)*80+"%",
            height:(nbLignesPiece+2) / ((nbLignesPiece!=nbLignesGrille ?  maxLignesPiece : nbLignesGrille   )+2) *100+"%",
            
        }} 
       
    >
       {renderGrille()}
    </div>
        
        
    );
}
 
export default Piece;