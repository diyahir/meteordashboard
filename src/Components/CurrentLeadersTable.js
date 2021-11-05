import React from 'react';
import { Container } from 'semantic-ui-react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
const CurrentLeadersTable = ({ props }) => {

    if(props == undefined){
        return null
    }

    console.log(props)
    const renderLeveragedPoolRow = (contributorObj) => {
        return(
            <tr className="Table-Row">
                <td>{contributorObj.amount}</td>
                <td>{contributorObj.from}</td>
            </tr>
        )
    }


    return ( 
        <table id="Current-Leaders-Table" className="ui small selectable inverted table">

            <thead>
                <tr>
                    <th>Contribution</th>
                    <th>Wallet ID</th>
                </tr>
            </thead>
            <tbody>
                {Object.values(props).map(renderLeveragedPoolRow)}
            </tbody>
        </table>
    );
}
 
export default CurrentLeadersTable;