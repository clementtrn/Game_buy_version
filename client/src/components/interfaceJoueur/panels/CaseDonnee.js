import React from 'react'
import '../../../styles/TactBandeauTop.css';


const CaseDonnee = ({
    name,
    value,
    primary,
    flexFactor,
    textes,
    data
}) => {
    const getText = (name) => {
        try {
            if (textes == null) {
                return name
            } else {
                return textes["label" + name.charAt(0).toUpperCase() + name.slice(1)].contenu
            }
        } catch (error) {
            console.log(name)
        }

    }

    return (
        <div
            className="case-panel"
            style={{
                flexDirection: primary ? "column" : "row",
                flex: flexFactor
            }}
        >
            {
                name == "budgetRestant" && data ?
                <>
                <label 
                className="label-title"
                style={{
                    fontSize:!primary ?  15 : null,
                    color:"red"
                }}
            >
                {getText("budgetMaxAtteint")}
                </label>
           
               
                    <span className="case-value" >
                        {value}
                    </span>
                </>




                    :




                <>
                    <label
                        className="label-title"
                        style={{
                            fontSize: !primary ? 15 : null
                        }}
                    >
                        {getText(name)}
                    </label>
           
               
                {
                name == "cycle" || name == "sequence" || name == "tour" ?
                    <span className="case-value" >
                        {value + " "}<span style={{ color: "red" }}>{" / " + (data)}</span>
                    </span>

                    :
                    <span
                        className="case-value"
                    > {value}</span>

                }
                </>
            }

        </div>



    );
}

export default CaseDonnee;