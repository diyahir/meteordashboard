import React from 'react';
import { Container } from 'semantic-ui-react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
const CurrentShowerData = ({ props }) => {

    console.log(props)
    if(props == undefined){
        return null
    }

    function getItemNumber( percent, totalLength ){
        var num = Math.floor(totalLength*percent/100) + 10 
        if(num == NaN){
            return null
        }
        return num
    }



    return ( 
        
        <table className="ui tiny selectable inverted table">

            <thead>
                <tr>
                    <th>Tier</th>
                    <th>Breakdown</th>
                    <th>Available</th>
                    <th>Odds of Egg</th>
                    <th>Min Contribution (UST)</th>
                </tr>
            </thead>
            <tbody>
                <tr >
                    <td>Legendary</td>
                    <td>Top 10</td>
                    <td>10</td>
                    <td>100%</td>
                    <td> {props[10].amount} </td>
                </tr>
                <tr >
                    <td>Ancient</td>
                    <td>Next 9%</td>
                    <td>30</td>
                    <td> {(100*30/(props.length*0.09)).toFixed(2)}% </td>
                    <td> {props[getItemNumber(9,props.length)].amount} </td>
                </tr>
                <tr >
                    <td>Rare</td>
                    <td>Next 22%</td>
                    <td>60</td>
                    <td> {100*(60/(props.length*0.22)).toFixed(2)}% </td>
                    <td> {props[getItemNumber(31,props.length)].amount }</td>
                </tr>
                <tr >
                    <td>Common</td>
                    <td>Remainder</td>
                    <td>101</td>
                    <td> {((101/(props.length*0.69 - 10))*100).toFixed(2)}%  </td>
                    <td> 8 </td>
                </tr>
            </tbody>
        </table>
    );
}
 
export default CurrentShowerData;