import { withWidth } from '@material-ui/core';
import React, { useState, useEffect } from 'react'

const MurPiece = ({
    num,
    height,
    width,
    type,
    coordX,
    coordY,
    nbColonnesPiece,
    nbLignesPiece,
    nbColonnesGrille,
    nbLignesGrille,
    anchor,
    propositionMursDetruire,
    handleClicMur,
    mursH,
    mursV
}) => {
    // console.log(nbColonnesGrille,nbLignesGrille)
    const epaisseurInit = 1
    const epaisseur = type > 0 ? type > 4 ? epaisseurInit * 8 : epaisseurInit * 4 : 1
    const [mounted, setMounted] = useState(false)
    const [transform, setTranform] = useState([0, 0])
    const [clignotant, setClignotant] = useState(false)
    const colors = [
        "", // 0 simple
        "#313131", // 1 large
        "black", // 2 porteur
        "green", // 3 marqueur dégat 1,
        "green", // 4 marqueur dégat 2
        "#490000",//5 porte closed
        "#490000",//6 porte open
    ]
    const colorClignotant = "#E26F00"

    const getTransform = (coordX, coordY) => {


        if (num == 0 || num == 2) { // horizontal

            let facteurX = 1
            let facteurY = 1

            try {
                if (mursH[coordY][coordX - 1] == 2) facteurX = -1
            } catch (error) { }
            try {
                if (mursH[coordY + 1][coordX - 1] == 2) facteurX = -1
            } catch (error) { }

            if (coordY - anchor[0] > nbLignesPiece - 2) {
                facteurY = -1
            }

            const translateX = facteurX * width * 0.9
            const translateY = facteurY * epaisseur / 1.5
            return [translateX, translateY]
        }



        if (num == 1 || num == 3) { // vertical
            let facteurX = 1
            let facteurY = 1

            try {
                if (mursV[coordY - 1][coordX] == 2) facteurY = -1
            } catch (error) { }
            try {
                if (mursV[coordY - 1][coordX + 1] == 2) facteurY = -1
            } catch (error) { }


            if (coordX - anchor[1] > nbColonnesPiece - 2 || coordX == 5) {
                facteurX = -1
            }
            const translateX = facteurX * epaisseur / 1.5
            const translateY = facteurY * height * 0.9
            return [translateX, translateY]

            // return 'translate(' + translateX + "px," + translateY + "px)"
        }
    }

    const getOpacity = () => {

        if (num == 0 && (coordY - anchor[0] > nbLignesPiece - 2)) return 0

        if (num == 2 && !(coordY - anchor[0] > nbLignesPiece - 2)) return 0

        if (num == 1 && !(coordX - anchor[1] > nbColonnesPiece - 2 || coordX == 5)) return 0

        if (num == 3 && (coordX - anchor[1] > nbColonnesPiece - 2 || coordX == 6)) return 0

        return 1
    }



    useEffect(() => {
        setMounted(true)
        const transformNew = getTransform(coordX, coordY)
        if (transform[0] !== transformNew[0] || transform[1] !== transformNew[1]) {
            setTranform(transformNew)
        }

    })



    const checkInCoords = (index) => {
        var checked = false
        if(propositionMursDetruire!==null && propositionMursDetruire!==undefined){
            const mursADetruire = [1, 2, 3, 5, 6]
            propositionMursDetruire[index].forEach(item => {
                if (item[0] == coordX && item[1] == coordY && mursADetruire.includes(type)) checked = true  //case en question
                if (item[0] == coordX && item[1] == coordY + 1 && num == 2 && mursADetruire.includes(type)) checked = true  //case dessus
                if (item[0] == coordX && item[1] == coordY - 1 && num == 0 && mursADetruire.includes(type)) checked = true  //case dessous
                if (item[0] == coordX + 1 && item[1] == coordY && num == 1 && mursADetruire.includes(type)) checked = true  //case gauche
                if (item[0] == coordX - 1 && item[1] == coordY && num == 3 && mursADetruire.includes(type)) checked = true  //case droite
    
            });
            const valeurFerme = 5
            const valeurOuvert = 6
    
            switch (num) {
                // HORIZONTAL
                case 0:
                    try {
                        if (getTransform(coordX + 1, coordY)[0] < 0 && (mursH[coordY][coordX + 1] == valeurFerme || mursH[coordY][coordX + 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX + 1, coordY + 1)[0] < 0 && (mursH[coordY + 1][coordX + 1] == valeurFerme || mursH[coordY + 1][coordX + 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX - 1, coordY)[0] > 0 && (mursH[coordY][coordX - 1] == valeurFerme || mursH[coordY][coordX - 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX - 1, coordY - 1)[0] > 0 && (mursH[coordY - 1][coordX - 1] == valeurFerme || mursH[coordY - 1][coordX - 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    break;
    
                case 2:
                    try {
                        if (getTransform(coordX + 1, coordY)[0] < 0 && (mursH[coordY][coordX + 1] == valeurFerme || mursH[coordY][coordX + 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX + 1, coordY + 1)[0] < 0 && (mursH[coordY + 1][coordX + 1] == valeurFerme || mursH[coordY + 1][coordX + 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX - 1, coordY)[0] > 0 && (mursH[coordY][coordX - 1] == valeurFerme || mursH[coordY][coordX - 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX - 1, coordY + 1)[0] > 0 && (mursH[coordY + 1][coordX - 1] == valeurFerme || mursH[coordY + 1][coordX - 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    break;
    
                // VERTICAL   
                case 1:
                    try {
                        if (getTransform(coordX, coordY + 1)[1] < 0 && (mursV[coordY + 1][coordX] == valeurFerme || mursV[coordY + 1][coordX] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX + 1, coordY + 1)[1] < 0 && (mursV[coordY + 1][coordX + 1] == valeurFerme || mursV[coordY + 1][coordX + 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX, coordY - 1)[1] > 0 && (mursV[coordY - 1][coordX] == valeurFerme || mursV[coordY - 1][coordX] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX + 1, coordY - 1)[1] > 0 && (mursV[coordY - 1][coordX + 1] == valeurFerme || mursV[coordY - 1][coordX + 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    break;
    
                case 3:
                    try {
                        if (getTransform(coordX, coordY + 1)[1] < 0 && (mursV[coordY + 1][coordX] == valeurFerme || mursV[coordY + 1][coordX] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX - 1, coordY + 1)[1] < 0 && (mursV[coordY + 1][coordX - 1] == valeurFerme || mursV[coordY - 1][coordX - 1] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX, coordY - 1)[1] > 0 && (mursV[coordY - 1][coordX] == valeurFerme || mursV[coordY - 1][coordX] == valeurOuvert)) checked = false
                    } catch (error) { }
                    try {
                        if (getTransform(coordX - 1, coordY - 1)[1] > 0 && (mursV[coordY - 1][coordX - 1] == valeurFerme || mursV[coordY - 1][coordX - 1] == valeurOuvert)) checked = false
                    } catch (error) { }
    
                    break;
    
            }
        }
       


        return checked
    }



    useEffect(() => {
        setClignotant(checkInCoords(num % 2))
    })

    // const test = () => {
    //     console.log("coords X ", coordX, "coords Y ", coordY, "type", type)
    //     console.log(mursH[coordY])
    //     // console.log(propositionMursDetruire[0],propositionMursDetruire[1])
    //     // console.log(checkInCoords(0),checkInCoords(1))
    // }

    const renderPoignee = () => {
        let component = []

        switch (num) {
            case 0: // horizontal haut
                component.push(
                    <div // trait
                        key={0}
                        style={{
                            position: "absolute",
                            top: epaisseur,
                            height: epaisseur / 3,
                            backgroundColor: "#9F9F9F",
                            width: epaisseur / 2,
                            left: transform[0] > 0 ? width * 0.2 : null,
                            right: transform[0] < 0 ? width * 0.2 : null,
                            border: "1px solid black",


                        }} />
                )
                component.push(
                    <div // rond
                        key={1}
                        style={{
                            position: "absolute",
                            top: epaisseur * 1.3,
                            height: epaisseur,
                            background: "linear-gradient(20deg, rgba(100,100,100,1) 0%, rgba(194,194,194,1) 68%, rgba(236,236,236,1) 100%)",
                            width: epaisseur,
                            left: transform[0] > 0 ? width * 0.2 - epaisseur / 2 + epaisseur / 4 : null,
                            right: transform[0] < 0 ? width * 0.2 - epaisseur / 2 + epaisseur / 4 : null,
                            borderRadius: "100%",
                            border: "1px solid black",
                            boxShadow: "-1px 1px 1px 1px #9F9F9F"
                        }} />
                )
                break;
            case 2:
                component.push(
                    <div
                        key={2}

                        style={{
                            position: "absolute",
                            top: -epaisseur * 0.3 - 3,
                            height: epaisseur / 3,
                            backgroundColor: "#9F9F9F",
                            width: epaisseur / 2,
                            left: transform[0] > 0 ? width * 0.2 : null,
                            right: transform[0] < 0 ? width * 0.2 : null,
                            border: "1px solid black"
                        }} />
                )
                component.push(
                    <div
                        key={3}

                        style={{
                            position: "absolute",
                            top: -epaisseur * 1.3 - 3,
                            height: epaisseur,
                            background: "linear-gradient(20deg, rgba(100,100,100,1) 0%, rgba(194,194,194,1) 68%, rgba(236,236,236,1) 100%)",
                            width: epaisseur,
                            left: transform[0] > 0 ? width * 0.2 - epaisseur / 2 + epaisseur / 4 : null,
                            right: transform[0] < 0 ? width * 0.2 - epaisseur / 2 + epaisseur / 4 : null,
                            borderRadius: "100%",
                            border: "1px solid black",
                            boxShadow: "-1px 1px 1px 1px #9F9F9F"

                        }} />
                )
                break;
            case 1:
                component.push(
                    <div
                        key={4}
                        style={{
                            position: "absolute",
                            top: transform[1] > 0 ? height * 0.2 : null,
                            bottom: transform[1] < 0 ? height * 0.2 : null,
                            height: epaisseur / 3,
                            backgroundColor: "#9F9F9F",
                            width: epaisseur / 3,
                            right: epaisseur,
                            border: "1px solid black"
                        }} />
                )
                component.push(
                    <div
                        key={5}
                        style={{
                            position: "absolute",
                            top: transform[1] > 0 ? height * 0.2 - epaisseur / 6 - 1 : null,
                            bottom: transform[1] < 0 ? height * 0.2 - epaisseur / 6 - 1 : null,
                            // bottom: height * 0.2 - epaisseur / 6 - 1,
                            height: epaisseur,
                            background: "linear-gradient(20deg, rgba(100,100,100,1) 0%, rgba(194,194,194,1) 68%, rgba(236,236,236,1) 100%)",
                            width: epaisseur,
                            right: epaisseur * 1.3,
                            borderRadius: "100%",
                            border: "1px solid black",
                            boxShadow: "-1px 1px 1px 1px #9F9F9F"

                        }} />

                )
                break;
            case 3:
                component.push(
                    <div
                        key={6}
                        style={{
                            position: "absolute",
                            top: transform[1] > 0 ? height * 0.2 : null,
                            bottom: transform[1] < 0 ? height * 0.2 : null,
                            height: epaisseur / 3,
                            backgroundColor: "#9F9F9F",
                            width: epaisseur / 3,
                            left: epaisseur,
                            border: "1px solid black"
                        }} />
                )
                component.push(
                    <div
                        key={7}
                        style={{
                            position: "absolute",
                            top: transform[1] > 0 ? height * 0.2 - epaisseur / 6 - 1 : null,
                            bottom: transform[1] < 0 ? height * 0.2 - epaisseur / 6 - 1 : null,
                            height: epaisseur,
                            background: "linear-gradient(20deg, rgba(100,100,100,1) 0%, rgba(194,194,194,1) 68%, rgba(236,236,236,1) 100%)",
                            width: epaisseur,
                            left: epaisseur * 1.3,
                            borderRadius: "100%",
                            border: "1px solid black",
                            boxShadow: "-1px 1px 1px 1px #9F9F9F"

                        }} />
                )
                break;
        }


        return (component)
    }

    const renderTriangle = (top, bottom, left, rotate, marginLeft, marginTop, color) => {
        return (
            num % 2 == 0 ?
                <div
                    className={clignotant ? "triangle clignotant" : "triangle"}
                    style={{
                        borderTop: top + "px solid transparent",
                        borderBottom: bottom + "px solid transparent",
                        borderLeft: left + "px solid " + (clignotant ? "#E26F00" : color),
                        top: num == 0 ? marginTop : null,
                        bottom: num == 2 ? marginTop : null,
                        left: num == 0 ? marginLeft : null,
                        right: num == 2 ? marginLeft : null,
                        transform: "rotate(" + (rotate + num * 90) + "deg)",
                    }}
                ></div>
                :
                <div
                    className={clignotant ? "triangle clignotant" : "triangle"}
                    style={{
                        borderTop: left * 0.8 + "px solid " + (clignotant ? "#E26F00" : color),
                        borderLeft: (bottom) + "px solid transparent",
                        borderRight: top + "px solid transparent",
                        top: num == 1 ? -1 : null,
                        bottom: num == 3 ? -1 : null,
                        left: num == 3 ? marginTop - 1 : null,
                        right: num == 1 ? marginTop - 1 : null,
                        transform: "rotate(" + (rotate + 0 + (num - 1) * 90) + "deg) ",
                        zIndex: 10
                    }}
                ></div>
        )
    }

    const renderMarqueurDegat = () => {

        return (
            num % 2 == 0 ?
                <div
                    style={{
                        width: "50%",
                        height: epaisseur * 2 - 1,
                        top: num == 2 ? 0 : null,
                        bottom: num == 0 ? 0 : null,
                        left: num == 0 ? -1 : null,
                        right: num == 2 ? -1 : null,
                        // bottom:num==0 ? 0 : null,
                        position: "absolute",
                        // backgroundColor: "pink"

                    }}
                >
                    {/* COTES */}
                    <div style={{
                        position: 'absolute',
                        right: num == 2 ? 0 : null,
                        top: num % 2 == 1 ? 0 : 0,
                        backgroundColor: num % 2 == 1 ? "transparent" : 'black',
                        width: epaisseur,
                        height: epaisseur,
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        right: num == 2 ? 0 : null,
                        left: num % 2 == 1 ? 0 : null,
                        bottom: num % 2 == 1 ? 0 : 0,
                        backgroundColor: num % 2 == 1 ? "transparent" : 'black',
                        width: epaisseur,
                        height: epaisseur,
                    }}></div>
                    {type == 3 ?

                        <>
                            {renderTriangle(
                                0, epaisseur, width * 0.49,// top , bottom , left
                                0,// rotate
                                3, num % 2 == 1 ? -3 : -epaisseur / 2 + 2,// margin left, margin top
                                "black"// color
                            )}
                            {renderTriangle(
                                3, 3, width * 0.48,// top , bottom , left
                                0,// rotate
                                3, epaisseur / 4,// margin left, margin top
                                "black"// color
                            )}


                            {renderTriangle(
                                4, 0, width * 0.49,// top , bottom , left
                                0,// rotate
                                3, num % 2 == 1 ? 1 : epaisseur - 1,
                                "black"
                            )}

                        </>
                        :
                        <>
                            {renderTriangle(
                                0, epaisseur, width * 0.22,// top , bottom , left
                                0,// rotate
                                3, num % 2 == 1 ? -3 : -epaisseur / 2 + 2,// margin left, margin top
                                "black"// color
                            )}
                            {renderTriangle(
                                3, 3, width * 0.23,// top , bottom , left
                                0,// rotate
                                3, epaisseur / 4,// margin left, margin top
                                "black"// color
                            )}


                            {renderTriangle(
                                4, 0, width * 0.25,// top , bottom , left
                                0,// rotate
                                3, num % 2 == 1 ? 1 : epaisseur - 1,
                                "black"
                            )}

                        </>


                    }
                </div>
                :
                <div
                    style={{
                        width: epaisseur * 2 - 1,
                        height: height / 2,
                        top: num == 1 ? -1 : null,
                        bottom: num == 3 ? -1 : null,
                        left: num == 3 ? -epaisseur + 1 : null,
                        right: num == 1 ? -epaisseur : null,
                        position: "absolute",
                        // backgroundColor:"pink"

                    }}
                >
                    {/* COTES */}
                    <div style={{
                        position: 'absolute',
                        right: num == 2 ? 0 : null,
                        top: num == 1 ? -1 : null,
                        bottom: num == 3 ? -1 : null,
                        backgroundColor: num % 2 == 1 ? "transparent" : 'green',
                        width: epaisseur,
                        height: epaisseur,
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        right: num == 2 ? 0 : null,
                        left: num % 2 == 1 ? 0 : null,
                        top: num == 1 ? -1 : null,
                        bottom: num == 3 ? -1 : null,
                        backgroundColor: num % 2 == 1 ? "transparent" : 'red',
                        width: epaisseur,
                        height: epaisseur,
                    }}></div>
                    {type == 3 ?

                        <>
                            {renderTriangle(
                                0, epaisseur, height * 0.7,// top , bottom , left
                                0,// rotate
                                3, 1,// margin left, margin top
                                "black"// color
                            )}
                            {renderTriangle(
                                3, 3, height * 0.7,// top , bottom , left
                                0,// rotate
                                epaisseur / 4, epaisseur / 4,// margin left, margin top
                                "black"// color
                            )}


                            {renderTriangle(
                                4, 0, height * 0.7,// top , bottom , left
                                0,// rotate
                                3, epaisseur,
                                "black"
                            )}

                        </>
                        :
                        <>
                            {renderTriangle(
                                0, epaisseur, height * 0.3,// top , bottom , left
                                0,// rotate
                                3, 1,// margin left, margin top
                                "black"// color
                            )}
                            {renderTriangle(
                                3, 3, height * 0.3,// top , bottom , left
                                0,// rotate
                                epaisseur / 4, epaisseur / 4,// margin left, margin top
                                "black"// color
                            )}


                            {renderTriangle(
                                4, 0, height * 0.3,// top , bottom , left
                                0,// rotate
                                3, epaisseur,
                                "black"
                            )}

                        </>


                    }
                </div>
        )
    }
    // console.log(propositionMursDetruire)

    const renderCoins = () => {
        //    console.log("test")
        const typesConsideres = [1, 2]
        switch (num) {
            case 1:
                try {
                    if (typesConsideres.includes(mursH[coordY + 1][coordX + 1]) && typesConsideres.includes(mursV[coordY + 1][coordX + 1])) {
                        return (
                            <div
                                style={{
                                    position: "absolute",
                                    backgroundColor: colors[1],
                                    width: epaisseurInit * 4 * 2,
                                    height: epaisseurInit * 4 * 2,
                                    bottom: -epaisseurInit * 4,
                                    right: -1 - epaisseurInit * 4,
                                    // zIndex: 9
                                }}
                            ></div>
                        )
                    }
                } catch (error) { }
                try {
                    if (typesConsideres.includes(mursH[coordY][coordX + 1]) && typesConsideres.includes(mursV[coordY - 1][coordX + 1])) {
                        return (
                            <div
                                style={{
                                    position: "absolute",
                                    backgroundColor:  colors[1],
                                    width: epaisseurInit * 4 * 2,
                                    height: epaisseurInit * 4 * 2,
                                    top: -1 - epaisseurInit * 4,
                                    right: -1 - epaisseurInit * 4,
                                    // zIndex: 9
                                }}
                            ></div>
                        )
                    }
                } catch (error) { }
                break;

            case 3:
                try {
                    if (typesConsideres.includes(mursH[coordY + 1][coordX - 1]) && typesConsideres.includes(mursV[coordY + 1][coordX])) {

                        return (
                            <div
                                style={{
                                    position: "absolute",
                                    backgroundColor:  colors[1],
                                    width: epaisseurInit * 4 * 2,
                                    height: epaisseurInit * 4 * 2,
                                    bottom: -epaisseurInit * 4,
                                    left: -1 - epaisseurInit * 4,
                                    // zIndex: 9
                                }}
                            ></div>
                        )
                    }

                } catch (error) { }
                try {
                    if (typesConsideres.includes(mursH[coordY][coordX - 1]) && typesConsideres.includes(mursV[coordY - 1][coordX])) {

                        return (
                            <div
                                style={{
                                    position: "absolute",
                                    backgroundColor:  colors[1],
                                    width: epaisseurInit * 4 * 2,
                                    height: epaisseurInit * 4 * 2,
                                    top: -1 - epaisseurInit * 4,
                                    left: -1 - epaisseurInit * 4,
                                    // zIndex: 9
                                }}
                            ></div>
                        )
                    }

                } catch (error) { }
                break;


        }


        //    return null
    }


    return (
        <>
            <div
                className={clignotant ? "clignotant" : ""}
                key={8}
                onClick={clignotant ? () => {
                    // test()
                    handleClicMur(num, type, coordX, coordY)
                } : null}

                // : () => test()}
                style={{
                    position: "absolute",
                    width: num % 2 == 0 ? width + 2 : epaisseur,
                    height: num % 2 == 1 ? height + 1 : epaisseur,
                    right: num == 1 ? -1 : null,
                    left: num % 2 == 0 || num == 3 ? -1 : null,
                    top: num == 0 || num % 2 == 1 ? -1 : null,
                    bottom: num == 2 ? 0 : null,
                    // backgroundColor: (type > 0 && type != 2) ? colors[type] : 'transparent',
                    zIndex: type > 2 ? clignotant ? 1 : 3 : 4,
                    transform: type == 6 ? 'translate(' + transform[0] + "px," + transform[1] + "px)" : (type == 5 ? (num % 2 == 0 ? 'translate(0px,' + transform[1] + "px)" : 'translate(' + transform[0] + "px,0px)") : ""),
                    opacity: type == 5 || type == 6 ? getOpacity() : 1,
                    transition: type > 4 && mounted ? "1s" : "",
                    borderRadius: type > 4 ? 3 : 0,
                    border: type > 4 ? "1px solid black" : "",
                    boxShadow: type > 4 ? "-1px 1px 1px 1px #9F9F9F" : "",
                    backgroundColor: (type > 0 && type != 3 && type != 4) ? clignotant ? colorClignotant : colors[type] : 'transparent',
                    cursor: clignotant ? "pointer" : "",
                    // filter:clignotant && mouseOver ? "brightness(1)" : ""
                }}
            >
                {
                    type == 5 || type == 6 ?
                        renderPoignee()
                        :
                        null
                }
                {
                    type == 3 || type == 4 ?
                        renderMarqueurDegat()
                        :
                        null
                }

            </div>
            {
                type == 0 || type == 5 || type == 6 ?
                    renderCoins()
                    :
                    null
            }
        </>
    );
}

export default MurPiece;