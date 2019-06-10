import React from 'react';
import Canvas from "./Canvas";

const City = (props) => {

    const calcTemp = (windValue, tempValue) => 
    {
        // adapted from https://fi.wikipedia.org/wiki/Pakkasen_purevuus
        // in degrees Celsius
        
        // not numbers?
        if (Number.isNaN(windValue) || Number.isNaN(tempValue))
        {
            return;
        }

        let wctResult = 13.12 + 0.6215 * tempValue - 13.956 * Math.pow(windValue, 0.16) + 0.4867 * tempValue * Math.pow(windValue, 0.16);
        wctResult = wctResult.toFixed(2);

        return wctResult;
    }

    // https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words/54677081#54677081
    // answer by Matt Frear (September 16 2014, 11:02), modified
    const degToCardinal = (num) => {
        if (Number.isNaN(num)) {
            return;
        }

        const val = Math.floor((num / 22.5) + 0.5);
        const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[(val % 16)];
    }

    // https://stackoverflow.com/questions/50444126/react-check-props
    // answer by Chris  (May 21 2018, 8:19), modified
    if (props.finished && ((props.data || {}).temps !== undefined)) 
    {
        const imgSource = `http://openweathermap.org/img/w/${props.data.icons[0][0]}.png`;
        const imgAlt = `${props.data.icons[0][1].charAt(0).toUpperCase() + props.data.icons[0][1].slice(1)}`;

        return (
            <div>
                <table>
                    <tbody>
                        <tr><th>City:</th><td>{props.city}</td><th>Graphical representation of wind direction:</th></tr>
                        <tr><th>Temperature (in Celsius):</th><td>{props.data.temps[0]}</td><td rowspan="8" className="windgraph"><Canvas degrees={props.data.windDegrees[0]} width={150} height={150} title={`Wind direction: ${degToCardinal(props.data.windDegrees[0])} (${props.data.windDegrees[0]} degrees)`} /></td></tr>
                        <tr><th>Pressure (in hPa):</th><td>{props.data.pressures[0]}</td></tr>
                        <tr><th>Humidity (in %):</th><td>{props.data.humidities[0]}</td></tr>
                        <tr><th>Wind (meter / seconds):</th><td>{props.data.winds[0]}</td></tr>
                        <tr><th>Cardinal wind direction (from):</th><td>{degToCardinal(props.data.windDegrees[0])}</td></tr>
                        <tr><th>Wind direction (in degrees):</th><td>{props.data.windDegrees[0]}</td></tr>
                        <tr><th>Feels like (in Celsius):</th><td>{calcTemp(props.data.winds[0], props.data.temps[0])}</td></tr>
                        <tr><th>OpenWeatherMap's weather icon:</th><td><img src={imgSource} alt={imgAlt} title={imgAlt} /></td></tr>
                    </tbody>
                </table>
                
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default City;