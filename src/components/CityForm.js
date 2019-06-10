import React, { Component } from 'react';
import axios from 'axios';
import { API_KEY } from './apikeys';
import { Line } from 'react-chartjs-2';
import { BrowserRouter, Link, Route } from "react-router-dom";
import City from "./City";

let temps = [];
let times = [];
let pressures = [];
let humidities = [];
let winds = [];
let windDegrees = [];
let icons = [];
let cityData = {};

class CityForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            city : '', 
            formalcityname : "",
            graph : [],
            finished : false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let str = event.target.value;
        this.setState({city : str});
    }

    handleSubmit(event) {
        if (this.state.city !== '' ) 
        {
            event.preventDefault();

            // emptying the data array, otherwise submitting would just add to it when repeatedly submitted
            temps = [];
            times = [];
            pressures = [];
            humidities = [];
            winds = [];
            windDegrees = [];
            icons = [];
            cityData = {};
            
            const ROOT_URL = 'http://api.openweathermap.org/data/2.5/forecast';

            /*
                cnt: how many data points, in this calse limited to nine (24 hours), default much higher
                units: temperature in celsius
            */

            const fetchAddress = `${ROOT_URL}?q=${this.state.city}&units=metric&APPID=${API_KEY}`;

            axios.get(fetchAddress)
            .then(response => {

                this.setState({
                    city : this.state.city,
                    formalcityname : response.data.city.name,
                    graph : response.data.list
                })

                this.state.graph.map((measure => {
                    temps.push(measure.main.temp);
                    times.push(measure.dt_txt);
                    pressures.push(measure.main.pressure);
                    humidities.push(measure.main.humidity);
                    winds.push(measure.wind.speed);
                    windDegrees.push(measure.wind.deg);
                    icons.push([measure.weather[0].icon, measure.weather[0].description]);
                    return measure;
                }))

                cityData.temps = temps;
                cityData.times = times;
                cityData.pressures = pressures;
                cityData.humidities = humidities;
                cityData.winds = winds;
                cityData.windDegrees = windDegrees;
                cityData.icons = icons;

                this.setState({
                    finished : true
                })
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    handleChart(chartData, chartDates) {
        return {
            labels : chartDates,
            datasets : [{
                tension : 0,
                data : [...chartData],
                label : this.state.formalcityname,
                fill: false,
                borderColor: "#98B9AB"
            }]
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Link to="/">Form</Link>  <Link to="/graphs">Graphs</Link>
                <Route exact path="/" render={() =>
                    <div>
                        <form id="locationform" onSubmit={this.handleSubmit}>
                            <label>
                                <strong>Please enter the location and country (two letter country code), separated by a comma:</strong><br />
                                <input type="text" id="cityentry" value={this.state.city} onChange={this.handleChange} placeholder="Example: Oulu,fi" /> 
                                <input type="submit" value="Search" />
                            </label>
                        </form>
                        <City city={this.state.formalcityname} data={cityData} finished={this.state.finished} />
                    </div>
                } />
                <Route path="/graphs" render={() =>
                <div>
                    <h1>Weather forecast for the next 24 hours, temperatures in Celsius</h1>
                    <h2>Temperature</h2>
                    <Line data={this.handleChart(temps, times)} />
                    <h2>Pressure</h2>
                    <Line data={this.handleChart(pressures, times)} />
                </div>
                } />
            </BrowserRouter>
        )
    }
}

export default CityForm;