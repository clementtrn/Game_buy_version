import React, { useEffect, useState, useRef } from 'react';
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import ContentsAPI from "../../API/ContentsAPI"

import '../../styles/Interfaces.css';


const InterInterventions = ({
    budget,
    cycles,
    handleBudgetChange,
    type,
    currentCycle,
    currentSequence,
    budgetSim,
    couts,
    page,
    nbCycleParSeq,
    configuration

}) => {
    const lastRow = useRef(null)
    const nbPompiers = configuration.nbPompEquipe.valeur
    const [numCycle, setNumCycle] = useState(budgetSim.numCycle)
    const [lastCycle, setLastCycle] = useState(budgetSim)

    const initLocalPage=()=>{
        console.log("init local page")
        if(nbCycleParSeq>0 && budgetSim.numSeq>0){
            if(type=="interventions"){
                // return Math.floor(budgetSim.numSeq/nbCycleParSeq) 
                return cycles.length>0 ? Math.floor(cycles[cycles.length-1].numSeq/nbCycleParSeq) : 0
            }else{
                
                // return Math.floor((budgetSim.numSeq-1)*nbCycleParSeq+budgetSim.numCycle-1)
                return cycles.length>0 ? Math.floor((cycles[cycles.length-1].numSeq-1)*nbCycleParSeq+cycles[cycles.length-1].numCycle-1) : 0
            }
        }
        return 0    
    }
    const [localPage, setLocalPage] = useState(initLocalPage())

    // useEffect(()=>{
    //     console.log(localPage)
    // },[localPage])


    const renderHeaders = () => {
        var components = []
        components.push(
            <TableCell key={"head"+0} align="center" component="th">Séquence</TableCell>
        )
        components.push(
            <TableCell key={"head"+1} align="center" component="th">Cycle</TableCell>
        )
        if (type == "equipements") {
            components.push(
                <TableCell key={"head"+2} align="center" component="th">Type</TableCell>
            )
        }

        for (let i = 1; i <= nbPompiers; i++) {
            components.push(
                <TableCell key={"head"+i+3} align="center" component="th">Pompier {i}</TableCell>
            )
        }
        components.push(
            <TableCell key={1000} align="center" component="th">Total</TableCell>
        )
        return (
            <TableRow key={"header"}>
                {components}
            </TableRow>
        )
    }




    const [textes, setTextes] = useState(null)

    useEffect(() => {
        const getTextes = async () => {
            const textes = ContentsAPI.getTexts("jeuInterInterventions").then(
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
                console.log("label" + name.charAt(0).toUpperCase() + name.slice(1))
                return name
            }
        }
    }

    // useEffect(()=>{
    //     // setLocalPage(initLocalPage())
    // },[lastCycle])



    const initLastCycle = () => {
        
        // setLastCycle(
        //     type == "interventions" ?
        //         {
        //             numSeq: cycles.length>0 ? cycles.length%nbCycleParSeq == 0  ? cycles[cycles.length -1].numSeq +1 : cycles[cycles.length -1].numSeq :1 ,
        //             numCycle:(cycles.length)%nbCycleParSeq+1,
        //             pomp1: 0,
        //             pomp2: 0,
        //             pomp3: 0,
        //             pomp4: 0,
        //             pomp5: 0,
        //             pomp6: 0,

        //         }
        //         :
        //         {
        //             numSeq:cycles.length>0 ? cycles.length>1 ? cycles.length%2 == 0  ? cycles[cycles.length -1].numSeq +1 : cycles[cycles.length -1].numSeq : 1 :1 ,
        //             numCycle: (cycles.length)%2+1,
        //             Feu: {
        //                 pomp1: 0,
        //                 pomp2: 0,
        //                 pomp3: 0,
        //                 pomp4: 0,
        //                 pomp5: 0,
        //                 pomp6: 0,
        //             },
        //             FeuFum: {
        //                 pomp1: 0,
        //                 pomp2: 0,
        //                 pomp3: 0,
        //                 pomp4: 0,
        //                 pomp5: 0,
        //                 pomp6: 0,
        //             },
        //             Fum: {
        //                 pomp1: 0,
        //                 pomp2: 0,
        //                 pomp3: 0,
        //                 pomp4: 0,
        //                 pomp5: 0,
        //                 pomp6: 0,
        //             },
        //             Marqueur: {
        //                 pomp1: 0,
        //                 pomp2: 0,
        //                 pomp3: 0,
        //                 pomp4: 0,
        //                 pomp5: 0,
        //                 pomp6: 0,
        //             }
        //         }
        // )
        setLastCycle(budgetSim)
    }

    // useEffect(()=>{
    //     console.log("local page", localPage)
    // },[localPage])


    // useEffect(()=>{
    //     console.log(lastCycle)
    // },[lastCycle])

    const handleChangeSelect = (numPompier, event, key) => {
        var c = { ...lastCycle }
        if (type == "interventions") {
            c["pomp" + numPompier] = event.target.value
        } else {
            c[key]["pomp" + numPompier] = event.target.value
        }
        setLastCycle(c)
        handleBudgetChange(type, c)
        
    }

    const renderPropositionsBudget = (nSeq, nCycle, numPompier,value) => {
        let cycle = [...cycles].sort((a, b) => a.numCycle - b.numCycle).sort((a, b) => a.numSeq - b.numSeq)[(nSeq-1)*nbCycleParSeq+nCycle - 1]
        if (cycle == null) cycle = {...lastCycle}
        let sum = 0
        if (cycle != null) {
            Object.keys(cycle).forEach((key, index) => {
                if (key != "numCycle" && key !== "numSeq" && (numPompier !== index - 1 || nCycle < lastCycle.numCycle || nSeq<lastCycle.numSeq)) {
                    sum += cycle[key]
                }
            })
        }

        var components = []
        const maxValue = cycle != null && (nCycle < lastCycle.numCycle || nSeq<lastCycle.numSeq) ? sum : (budget.sequence - budget.depense - sum)
        // console.log(value)
        for (let i = 0; i <= Math.floor(maxValue/100); i++) {
            components.push(
                <MenuItem  key={"item"+nCycle+":"+numPompier+":"+i} value={i * 100} align="right" >{i * 100 + "€"}</MenuItem>
            )
        }
        return components
    }
    const renderSelectBudgetCycle = (nSeq,nCycle, disabled, numPompier, value) => {
        // console.log(nCycle)
        return (
            <FormControl disabled={disabled}  key={"select"+nSeq+":"+nCycle+" : "+numPompier} variant="outlined">
                <Select
                    value={value}
                    onChange={(value) => handleChangeSelect(numPompier, value)}
                    displayEmpty
                    color="secondary"
                    className={value==0 || disabled ? "empty" : ""}   
                >
                    <MenuItem value="" disabled align="center">
                        Budget {numPompier}
                    </MenuItem>

                    {renderPropositionsBudget(nSeq,nCycle, numPompier,value)}

                </Select >
            </FormControl>
        )
    }
    const renderRowBudgetCycle = (cycle) => {
            var comp = []
            var sum = 0
            if (cycle.numCycle % nbCycleParSeq == 1) {
                comp.push(
                    <TableCell key={"row"+cycle+":"+0} scope="row" align="center" component="th" rowSpan={nbCycleParSeq}>
                        Séquence n°{cycle.numSeq}
                    </TableCell>
                )
            }

            comp.push(
                <TableCell key={"row"+cycle+":"+1} scope="row" align="center" component="th" >
                    Cycle n°{cycle.numCycle}
                </TableCell>
            )

            const disabled = cycle.numSeq<lastCycle.numSeq || cycle.numCycle<lastCycle.numCycle
            // console.log(disabled)

            Object.keys(cycle).forEach((key, index) => {
                if (key != "numCycle" && key != "numSeq") {
                    comp.push(
                        <TableCell scope="row"  key={"row"+cycle+":pomp"+index} align="center">{renderSelectBudgetCycle(cycle["numSeq"],cycle["numCycle"],disabled, index - 1, cycle[key])}</TableCell>
                    )
                    sum += cycle[key]
                }
            })
            comp.push(
                <TableCell scope="row" align="center" key={1000} >

                    <TextField
                        variant="outlined"
                        disabled
                        value={sum + " €"}
                        inputProps={{
                            style: {
                                color: !(disabled) ? sum > budget.sequence - budget.depense ? "red" : "green" : null,
                                fontWeight: !disabled ? "bold" : null,
                                fontStyle: disabled ? "italic" : null ,
                                textAlign: "center",
                                backgroundColor: "#f1f1f1",
                                borderRadius: 5,
                            },
                        }}
                    />

                </TableCell>
            )
            return (
                <TableRow hover key={"row"+cycle.numSeq + " : " + cycle.numCycle+Math.random()} ref={cycle.numCycle >= currentCycle ? lastRow : null}>
                    {comp}
                </TableRow>
            )

    }
    const renderBudgetsCycles = () => {
        
        if (budgetSim.numCycle !== lastCycle.numCycle ) initLastCycle()
        // if(budgetSim.numCycle<lastCycle.numCycle) setLastCycle(budgetSim)
        const cyclesSorted = [...cycles].sort((a,b)=>a.numCycle-b.numCycle).sort((a,b)=>a.numSeq-b.numSeq)
        // console.log(cycles)
        var components = []
        cyclesSorted.forEach((cycle, index) => {
            // type=="interventions" ? Math.floor(currentCycle+(currentSequence-1)*nbCycleParSeq)/nbCycleParSeq-1: currentCycle-1
            if (cycle.numSeq < currentSequence || (cycle.numSeq == currentSequence && cycle.numCycle<currentCycle+1)) {

            if (cycle.numSeq==localPage+1 ) {
                // console.log("render",localPage,cycle.numCycle,cycle.numSeq)

                components.push(
                    renderRowBudgetCycle(cycle)
                )
            }
        }

        })

        // console.log(lastCycle,localPage)
        if (lastCycle.numSeq==localPage+1) {
            components.push(renderRowBudgetCycle(lastCycle))
        }

        return (
            components
        )
    }


    const renderPropositionsStock = (nSeq,nCycle, numPompier, key) => {
        let cycle = [...cycles].sort((a, b) => a.numCycle - b.numCycle).sort((a, b) => a.numSeq - b.numSeq)[(nSeq-1)*nbCycleParSeq+nCycle - 1]
        if (cycle == null) cycle = {...lastCycle}

        let sum=0

        if (cycle != null) {
            Object.keys(cycle).forEach((k) => {
                if (k != "numCycle" && k !== "numSeq" && k !== "type") {

                    Object.values(cycle[k]).forEach((value, index) => {
                        if ((key!==k ) || numPompier!==index+1 ||( nCycle < lastCycle.numCycle || nSeq<lastCycle.numSeq)) {
                            sum+= value * couts.equipements["coutEq" + k]
                            
                        }
                    });
                }
            })
        }

        var components = []
        const maxValue = cycle != null && (nCycle < lastCycle.numCycle || nSeq<lastCycle.numSeq) ? Math.floor((sum) / couts.equipements["coutEq" + key]) : Math.floor((budget.sequence - budget.depense - sum) / couts.equipements["coutEq" + key])
       
        
        for (let i = 0; i <= Math.max(0,maxValue); i++) {
            components.push(
                <MenuItem key={nCycle+":"+numPompier+":"+i} value={i} align="right" >{i}</MenuItem>
            )
        }
        return components
    }

    const renderSelectStockCycle = (nSeq,nCycle, disabled, numPompier, value, key) => {
        // console.log(value)
        return (
            <FormControl disabled={disabled} variant="outlined" key={nSeq+":"+nCycle+" :" +numPompier+":"+key+Math.random()}>
                <Select
                    value={value}
                    onChange={(value) => handleChangeSelect(numPompier, value, key)}
                    displayEmpty
                    color="secondary"
                    className={value==0 || disabled ? "empty" : ""}   

                >
                    <MenuItem value="" disabled align="center">
                        Stock {numPompier}
                    </MenuItem>

                    {renderPropositionsStock(nSeq,nCycle, numPompier, key)}

                </Select >
            </FormControl>
        )
    }

    const renderRowStocksCycle = (cycle, key, data) => {
        if (cycle.numCycle < currentCycle + 2) {
            var comp = []
            var sum = 0

            // console.log(key,data)
            const nbLignesParCycle = (Object.keys(lastCycle).length - 2)

            if (key == "Feu") {
                // if(cycle.numCycle%nbCycleParSeq==1){
                comp.push(
                    <TableCell key={"row"+cycle+":"+0} scope="row" align="center" component="th" rowSpan={nbCycleParSeq * (Object.keys(lastCycle).length - 2)}>
                        Séquence n°{cycle.numSeq}
                    </TableCell>
                )
                // }
                comp.push(
                    <TableCell key={"row"+cycle+":"+1} scope="row" align="center" component="th" rowSpan={Object.keys(lastCycle).length - 2}>
                        Cycle n°{cycle.numCycle}
                    </TableCell>
                )
            }

            comp.push(
                <TableCell key={"row"+cycle+":"+2} scope="row" align="center"  >
                    {getText(key!=="Marqueur" ? "Ext"+key : key)}
                </TableCell>
            )
            const disabled = cycle.numSeq<lastCycle.numSeq || cycle.numCycle<lastCycle.numCycle
            // console.log()
            if (data !== null && data !== undefined) {
                Object.keys(data).forEach((k, index) => {
                    if (k != "numCycle" && k != "numSeq" && k !== "type") {
                        comp.push(
                            <TableCell key={"row"+cycle+":pomp"+index + 3} align="center" scope="row">{renderSelectStockCycle(cycle.numSeq,cycle.numCycle, disabled, index + 1, data[k], key)}</TableCell>
                        )
                        sum += data[k] * couts.equipements["coutEq" + key]
                    }
                })
            }

            comp.push(
                <TableCell scope="row" align="center" key={20} >
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        disabled
                        value={sum + " €"}
                        inputProps={{
                            style: {
                                color: !disabled ? sum > budget.sequence - budget.depense ? "red" : "green" : null,
                                fontWeight: !disabled? "bold" : null,
                                fontStyle: disabled ? "italic" : null,
                                textAlign: "center",
                                backgroundColor: "#f1f1f1",
                                borderRadius: 5,
                                // minWidth: 70

                            },
                        }}
                    />
                </TableCell>
            )

            return (
                <TableRow hover key={cycle.numSeq + " : " + cycle.numCycle + " : " + key+Math.random()} ref={cycle.numCycle >= currentCycle ? lastRow : null}>
                    {comp}
                </TableRow>
            )

        } else {
            return null
        }
    }

    const renderStocksCycle = () => {
        if (budgetSim.numCycle !== lastCycle.numCycle ) initLastCycle()
        const cyclesSorted = [...cycles].sort((a, b) => (a.numSeq-b.numSeq)*100+a.numCycle - b.numCycle)
        var components = []
        cyclesSorted.forEach((cycle, index) => {
            if (index == localPage) {
                Object.keys(cycle).forEach(key => {
                    if (key !== "numSeq" && key !== "numCycle") {
                        components.push(
                            renderRowStocksCycle(cycle, key, cycle[key])
                        )
                    }
                });
            }
        })
        if (localPage == (lastCycle.numSeq-1)*nbCycleParSeq+lastCycle.numCycle - 1) {
            Object.keys(lastCycle).forEach(key => {
                if (key !== "numSeq" && key !== "numCycle") {
                    components.push(renderRowStocksCycle(lastCycle, key, lastCycle[key]))

                }
            });
        }


        return (
            components
        )
    }

    const handleChangePage = (event, newPage) => {
        setLocalPage(newPage);
        // console.log("new Page", newPage)
    };


    return (
        <div className="container">
            <TableContainer component={Paper} className="tableau">
                <Table stickyHeader size="small" >
                    <TableHead>
                        {renderHeaders()}
                    </TableHead>
                    <TableBody>
                        {
                            type == "interventions" ?
                                renderBudgetsCycles()

                                : null
                        }
                        {
                            type == "equipements" ?
                                renderStocksCycle()

                                : null
                        }

                    </TableBody>
                    <TableFooter>
                        <TableRow key="footer-row">
                            <TablePagination
                                rowsPerPageOptions={[Object.keys(lastCycle).length - 2]}
                                // colSpan={3}
                                count={type == "interventions" ? lastCycle.numSeq*nbCycleParSeq : (lastCycle.numSeq-1)*nbCycleParSeq+ lastCycle.numCycle}
                                
                                rowsPerPage={type == "interventions" ? nbCycleParSeq : 1}
                                page={localPage}
                                // labelDisplayedRows={({ from, to, count }) => type == "interventions" ? "Séquence n° " + Math.ceil(from/nbCycleParSeq) + " | Cycles "+1+" - "+(nbCycleParSeq) : "Séquence n° " + Math.ceil(from/nbCycleParSeq) + "    |    Cycle n° " + ((to+1)%nbCycleParSeq+1) }
                                labelDisplayedRows={({ from, to, count }) => type == "interventions" ? "Séquence n° " + Math.ceil(from/nbCycleParSeq) + " | Cycles "+1+" - "+(nbCycleParSeq) : "Séquence n° " + Math.ceil(from/nbCycleParSeq) + "    |    Cycle n° " + ((localPage)%nbCycleParSeq+1) }

                                // SelectProps={{
                                //     inputProps: { 'aria-label': 'rows per page' },
                                //     native: true,
                                // }}
                                onChangePage={handleChangePage}
                            // onRowsPerPageChange={handleChangeRowsPerPage}
                            // ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    )
}

export default InterInterventions;