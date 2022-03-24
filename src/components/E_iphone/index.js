// import preact
import { h, render, Component } from "preact";
import { useState } from "preact";
// import stylesheets for ipad & button
import style from "./style";
import style_iphone from "../button/style_iphone";
// import jquery for API calls
import $ from "jquery";
// import the Button component
import Button from "../button";

export default class ExpIphone extends Component {
	//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props) {
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ locate: this.props.locate });
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = (location) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		$.ajax({
			url: `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=${this.props.API_Key}`,
			dataType: "jsonp",
			success: this.parseGeoCoords,
			error: function (req, err) {
				console.log("API call failed " + err);
			},
		});
		// once the data grabbed, hide the button
		this.setState({ display: false });
	};
	//forecast = ()

	fetchWeather = () => {
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.lon}&units=metric&appid=${this.props.API_Key}`,
			dataType: "jsonp",
			success: this.parseResponse,
			error: function (req, err) {
				console.log("API call failed " + err);
			},
		});
	};

	// the main render method for the iphone component
	render() {
		const tempStyles = this.state.temp
			? `${style.temperature} ${style.filled}`
			: style.temperature;

		// display all weather data
		return (
			<div class={style.container}>
				<div class={style.header}>
					<div class={style.city}>{this.props.locate}</div>
					<span class={tempStyles} onClick={this.props.toggleScreen}>
						{this.state.temp}
					</span>
					<div style="margin-bottom: 50%">
						<p class={style.degSign}>
							Minimum Temperature: {this.state.temp_min}
						</p>
						<p class={style.degSign}>
							Maximum Temperature: {this.state.temp_max}
						</p>
						<p>Pressure: {this.state.press}hPa</p>
						<p>Humidity: {this.state.humid}%</p>
						<p>Cloud Coverage: {this.state.c_coverage}%</p>
						<p>Wind Speed: {this.state.w_speed}m/s</p>
						<p>Wind Direction: {this.state.w_direction}</p>
					</div>
				</div>
			</div>
		);
	}

	parseGeoCoords = (parsed_json) => {
		var location = parsed_json["name"];
		var lon = parsed_json["coord"]["lon"];
		var lat = parsed_json["coord"]["lat"];

		console.log(parsed_json);

		this.setState({
			locate: location,
			lon: lon,
			lat: lat,
		});

		this.fetchWeather();
	};

	parseResponse = (parsed_json) => {
		let daily = parsed_json["daily"];
		let count = daily.length;
		console.log(daily);

		var day = new Date().getDate();
		var month = new Date().getMonth();
		var year = new Date().getFullYear();

		var datelong =
			String(year) +
			"-" +
			String(month + 1) +
			"-" +
			String(day + this.props.changeDay) +
			" 12:00:00";

		var d = new Date(datelong);
		var num = d / 1000;

		for (let i = 0; i < count; i++) {
			if (daily[i]["dt"] == num) {
				var temp_c = daily[i]["temp"]["day"];
				var temp_min = daily[i]["temp"]["min"];
				var temp_max = daily[i]["temp"]["max"];
				var pressure = daily[i]["pressure"];
				var humidity = daily[i]["humidity"];
				var c_coverage = daily[i]["clouds"];
				var w_speed = daily[i]["wind_speed"];
				var w_deg = daily[i]["wind_deg"];
			}
		}

		let w_direction = this.fetchCompass(w_deg);

		console.log(parsed_json);
		// set states for fields so they could be rendered later on
		this.setState({
			temp: temp_c.toFixed(),
			temp_min: temp_min,
			temp_max: temp_max,
			press: pressure,
			humid: humidity,
			c_coverage: c_coverage,
			w_speed: w_speed,
			w_direction: w_direction,
		});
	};

	fetchCompass(deg) {
		if (deg < 22.5 || deg >= 337.5) {
			return "North";
		} else if (deg < 67.5) {
			return "North-East";
		} else if (deg < 112.5) {
			return "East";
		} else if (deg < 157.5) {
			return "South-East";
		} else if (deg < 202.5) {
			return "South";
		} else if (deg < 247.5) {
			return "South-West";
		} else if (deg < 292.5) {
			return "West";
		} else {
			return "North-West";
		}
	}

	componentDidMount() {
		this.fetchWeatherData(this.state.locate);
	}
}
