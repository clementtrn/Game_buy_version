
const urlBack = "https://www.back.leaders-extreme.fr";

export default {
    login: async(dataConnexion)=>{
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataConnexion)
        };

        const response = await  fetch(urlBack+"/login", requestOptions)

        return  await response.json()
    },
    getNbEquipes:async(session)=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session:session
            })
        };

        const response = await  fetch(urlBack+"/getNbEquipes", requestOptions)

        return  await response.json()
    },
    getUsers:async(session)=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session:session
            })
        };

        const response = await  fetch(urlBack+"/getUsers", requestOptions)

        return  await response.json()
    },
    createUsers:async(session,nbEquipes,users)=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session:session,
                nbEquipes:nbEquipes,
                users:users
            })
        };

        const response = await  fetch(urlBack+"/createUsers", requestOptions)

        return  await response.json()
    },
};