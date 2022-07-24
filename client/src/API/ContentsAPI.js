
const urlBack = "https://www.back.leaders-extreme.fr";

export default {
    getTexts: async(nomView)=>{
        
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
        },
            body: JSON.stringify({nomView:nomView})
        };

        const response = await  fetch(urlBack+"/contents", requestOptions)

        return  await response.json()
    },
};