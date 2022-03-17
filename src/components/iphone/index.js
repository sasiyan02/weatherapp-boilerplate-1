// import preact
import { h, render, Component } from 'preact';
import { useState } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ time : new Date().getHours() });
		
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = (location) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=1e5e1a291b2a57ed2cc99894fa240567`;
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}
	forecast = ()
	
	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		const getinput = (event)=> {
			const loc = event.target.value;
			this.fetchWeatherData(loc);
			console.log(loc);
		};
		const uptime = () =>{
			this.setState({ time : this.state.time + 1});
		}
		const downtime = () =>{
			if this
			this.setState({ time : this.state.time - 1});
		}
		
		// display all weather data
		return (
			<div class={ style.container }>
				<div class={ style.header }>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<span class={ tempStyles }>{ this.state.temp }</span>
				</div>
				<div class={ style.details }></div>
				<div class= "search-box">
					<input type="text" 
						class="search"
						placeholder="Search Location"
						onChange = {getinput}/>
				</div>
				<div>
					<button type="button" onClick={uptime}><i class="fa-solid fa-angle-up"></i></button>
					<p class = "time-name">{this.state.time}</p>
					<button type="button" onClick={downtime}><i class="fa-solid fa-angle-down"></i></button>
				</div>
				<div class= { style_iphone.container }> 
					
				</div>
			</div>
		);
	}

	parseResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];
		
		console.log(parsed_json);
		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions
			time : new Date().getHours()
		});      
	}
}
