import React, { useEffect, useState,useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import '../../styles/Grille.css';
import Piece from "./pieces/Piece"
import { useScrollTrigger } from '@material-ui/core';



const Grille = ({
    nbColonnesGrille,
    nbLignesGrille,
    carte,
    position,
    mursH,
    mursV,
    propositionMursDetruire,
    propositionsCase,
    handleClicMur,
    handleClicCase,
    handleChangePiece,
    deplacementEnCours
}) => {

    const [maxLignesPiece, setMaxLignesPiece] = useState(0)
    const [maxColonnesPiece, setMaxColonnesPiece] = useState(0)

    const IdAnchor=useRef(null)

    const associate = (minimums, maximums) => {
        var anchors = []
        var maxUsed = []
        var maxCPiece = 0
        var maxLPiece = 0

        // maximums.sort((a,b)=>b[1]-a[1]).sort((a,b)=>a[0]-b[0])
        // var firstAssociation=[]
        // console.log(minimums.length)
        minimums.forEach((min, index) => {
            var Max = [nbLignesGrille, nbColonnesGrille]
            // var possiblesMax=[]
            maximums.forEach(max => {
                if ((max[0] >= min[0] && max[1] >= min[1]) && (max[0] <= Max[0] && max[1] <= Max[1]) && (min[0] < max[0] || min[1] < max[1]) && !maxUsed.includes(max)) {
                    Max = max
                }
                // if((max[0]>=min[0] && max[1]>=min[1]) && (min[0]<max[0] || min[1]<max[1])){
                //     possiblesMax.push( max)
                // }
            });
            // console.log("min : ",index,min,possiblesMax)
            maxUsed.push(Max)
            anchors.push([min, Max])

            if (maxCPiece < Max[1] - min[1]) {
                maxCPiece = Max[1] - min[1] + 1
            }
            if (maxLPiece < Max[0] - min[0]) {
                maxLPiece = Max[0] - min[0] + 1
            }
        })


        if (maxColonnesPiece == 0) {
            setMaxColonnesPiece(maxCPiece)
        }
        if (maxLignesPiece == 0) {
            setMaxLignesPiece(maxLPiece)
        }
        // console.log("Anchors : ",anchors)

        return (anchors)
    }

    const getAnchors = () => {
        var minimums = []
        var maximums = []
        for (let i = 0; i < mursV.length; i++) {
            for (let j = 0; j < mursH[i].length; j++) {
                if (mursV[i][j] > 0 && mursH[i][j] > 0) {
                    minimums.push([i, j])
                }
                if (mursV[i][j + 1] > 0 && mursH[i + 1][j] > 0) {
                    maximums.push([i, j])
                }
            }
        }
        return associate(minimums, maximums)
    }

    const getAnchor = (anchors, pos) => {
        // console.log("get anchor")
        var Min = [-1, -1]
        var Index = -1
        anchors.forEach((a, index) => {
            const min = a[0]
            const max = a[1]
            if (pos[0] >= min[0] && pos[1] >= min[1] && pos[0] <= max[0] && pos[1] <= max[1]) {
                Min = min
                Index = index
            }
        });
        return [Min, Index]
    }




    const renderPieces = () => {
        var components = []
        // console.log("render piece")
        let nbL
        let nbC
        let [anchor, idAnchor] = [[-1, -1], 0  ]
        try {
            
            const anchors = getAnchors()


            if (position[0] < nbLignesGrille && position[1] < nbColonnesGrille) {

                [anchor, idAnchor] = getAnchor(anchors, position)
                if (anchor[0] < 0 && anchor[1] < 0) {
                    nbL = nbLignesGrille
                    nbC = nbColonnesGrille
                } else {
                    const area = anchors[idAnchor]
                    nbL = area[1][0] - area[0][0] + 1
                    nbC = area[1][1] - area[0][1] + 1
                }
            } else {
                nbL = nbLignesGrille
                nbC = nbColonnesGrille
            }
        } catch (error) {
            nbL = nbLignesGrille
            nbC = nbColonnesGrille
        }

        if(idAnchor!==IdAnchor.current){
            if(IdAnchor.current!==null){
                handleChangePiece()
            }
            IdAnchor.current=idAnchor
          
            
        }


        components.push(
            <Piece
                key={idAnchor}
                mursH={mursH}
                mursV={mursV}
                carte={carte}
                position={position}
                nbLignesPiece={nbL}
                nbColonnesPiece={nbC}
                nbLignesGrille={nbLignesGrille}
                nbColonnesGrille={nbColonnesGrille}
                maxLignesPiece={maxLignesPiece}
                maxColonnesPiece={maxColonnesPiece}
                propositionMursDetruire={propositionMursDetruire}
                propositionsCase={propositionsCase}
                handleClicMur={handleClicMur}
                handleClicCase={handleClicCase}
                anchor={anchor[0] < 0 && anchor[1] < 0 ? [0, 0] : anchor}
                anchors={getAnchors()}
                deplacementEnCours={deplacementEnCours}
                getAnchor={getAnchor}
            />
        )
        return components
    }


    return (
        <div
            className="piece-container"
        >
            {renderPieces()}
        </div>
    )
}

export default Grille;