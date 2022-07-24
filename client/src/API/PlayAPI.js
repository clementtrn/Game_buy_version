



const urlBack = "https://www.back.leaders-extreme.fr";


export default {
    disconnectUsers:async(socket,session)=>{
        console.log("disconnect users")
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session:session,
                start:false
            })
        };


        fetch(urlBack + "/startStopPartie", requestOptions)
            .then(() => {
                socket.emit(
                    'disconnectUsers',
                    {
                        start: false,
                    }
                )
            })
    },
    startStopPartie: async (socket,session,start) => {
        console.log("start/stop partie")
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session:session,
                start:start
            })
        };


        fetch(urlBack + "/startStopPartie", requestOptions)
            // .then((response) => {
            //     console.log("test")
            //     return response.json();
            // })
            .then(() => {
                socket.emit(
                    'startStopPartie',
                    {
                        start: start,
                    }
                )
            })

    },
    nouveauTour: async (socket,currentPomp, carte, mursH, mursV, currentSequence, currentCycle, currentTour, resultatsDecedes, resultatsSauves, session, equipe, chrono) => {
        // console.log("nouveau tour")
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                carte: carte,
                mursH: mursH,
                mursV: mursV,
                currentPomp: currentPomp,
                currentSequence: currentSequence,
                currentCycle: currentCycle,
                currentTour: currentTour,
                resultatsDecedes: resultatsDecedes,
                resultatsSauves: resultatsSauves,
                session: session,
                equipe: equipe,
                currrentChrono: chrono
            })
        };


        fetch(urlBack + "/nouveauTour", requestOptions)
            // .then((response) => {
            //     console.log("test")
            //     return response.json();
            // })
            .then(() => {
                socket.emit(
                    'changementTour',
                    JSON.stringify({
                        currentSequence: (currentSequence),
                        currentPomp: (currentPomp),
                        currentTour: (currentTour),
                        currentCycle: (currentCycle),
                        equipe:equipe,
                        session:session
                    })
                )
                // console.log("changement tour")
            })

    },
    // getSocket: () => {
    //     return socket
    // },
    getConfiguration: async (session) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: session })
        };
        const response = await fetch(urlBack + "/configuration", requestOptions)
        return await response.json()
    },
    getPlayState: async (session, equipe) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: session,
                equipe: equipe
            })
        };
        const response = await fetch(urlBack + "/playstate", requestOptions)
        return await response.json()
    },
    revealHabitant: async (socket,position, type) => {
        // console.log(position[0])
        socket.emit(
            'revealHabitant',
            {
                y: parseInt(position[0]),
                x: parseInt(position[1]),
                type: parseInt(type)
            }
        )
        console.log("socket emit")
    },
    saveBudgetsPompInit: async (cycles, session, equipe) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cycles: cycles,
                session: session,
                equipe: equipe
            })
        };

        const response = await fetch(urlBack + "/saveBudgetsPompInit", requestOptions)


        return await response.json()
    },
    saveBudgetsPompFin: async (budgetsFin, session, equipe) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                budgetsFin: budgetsFin,
                session: session,
                equipe: equipe
            })
        };
        // console.log("budgets fin")

        const response = await fetch(urlBack + "/saveBudgetsPompFin", requestOptions)
        // console.log("save budgets fin")
        return response
    },
    getBudgetsPompInit: async (session, equipe, numPompier, currentCycle, currentSequence) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: session,
                equipe: equipe,
                numPompier: numPompier,
                cycle: currentCycle,
                sequence: currentSequence
            })
        };

        const response = await fetch(urlBack + "/getBudgetsPompInit", requestOptions)


        return await response.json()
    },
    getBudgetsPompFin: async (session, equipe) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session: session,
                equipe: equipe
            })
        };

        const response = await fetch(urlBack + "/getBudgetsPompFin", requestOptions)


        return await response.json()
    },
    updateCurrentChrono: async (chrono, session, equipe) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chrono: chrono,
                session: session,
                equipe: equipe
            })
        };

        const response = await fetch(urlBack + "/updateChrono", requestOptions)

        return await response.json()
    },
    updateConfig:async(manualConfig,session)=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                manualConfig: manualConfig,
                session: session
            })
        };

        return fetch(urlBack + "/updateConfig", requestOptions)
    },
    resetPartie:async(nbEquipes,session,etats,chronoInit)=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // count: count,
                nbEquipes:nbEquipes,
                session: session,
                etats:etats,
                chronoInit:chronoInit
            })
        };

        return fetch(urlBack + "/resetPartie", requestOptions)
    },
    getGeneralStats:async(session)=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:  JSON.stringify({
                session: session
            })
        };

        const response = await  fetch(urlBack+"/getGeneralStats", requestOptions)

        return  await response.json()
    }

};
