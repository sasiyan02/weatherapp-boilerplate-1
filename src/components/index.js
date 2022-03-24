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

export default class Iphone extends Component {
	//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props) {
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.state.id = "";
		this.state.time = new Date().getHours();
		this.state.day = new Date().getDate();
		this.state.month = new Date().getMonth();
		this.state.year = new Date().getFullYear();
		this.state.uptimer = 0;
		this.state.upcount = 0;
		this.state.latitude = 0;
		this.state.longitude = 0;
		this.state.main = "";
		this.state.link = "";
		this.state.timezone = 0;
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = (location) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=${this.props.API_Key}`;
		$.ajax({
			url: url,
			dataType: "jsonp",
			success: this.parseResponse,
			error: function (req, err) {
				console.log("API call failed " + err);
			},
		});
		this.setState({ display: true });
		// once the data grabbed, hide the button
	};
	find = (data) => {
		var hourly = data["hourly"];

		var datelong =
			String(this.state.year) +
			"-" +
			String(this.state.month + 1) +
			"-" +
			String(this.state.day) +
			" " +
			String(this.state.time) +
			":00:00";

		var d = new Date(datelong);

		var num = d / 1000;
		var count = Object.keys(hourly).length;

		for (let i = 0; i < count; i++) {
			if (hourly[i]["dt"] == num) {
				var temp_c = hourly[i]["temp"];
				var conditions = hourly[i]["weather"][0]["description"];
				var idTaken = hourly[i]["weather"][0]["id"];
				var main_weath = hourly[i]["weather"][0]["main"];

				this.setState({
					temp: temp_c.toFixed(),
					cond: conditions,
					id: idTaken,
					main: main_weath,
				});

				this.iconrec();
			}
		}
	};

	calctime = () =>{

	}

	voice = () => {
		let msg = new SpeechSynthesisUtterance();
		msg.rate = 0.75;
		msg.text =
			"Current weather in" +
			"!" +
			this.props.locate +
			"!" +
			"is" +
			"!" +
			this.state.cond +
			"!" +
			" with a temperature of" +
			"!" +
			Math.floor(this.state.temp) +
			"degree celcius";
		speechSynthesis.speak(msg);
	};

	iconrec = () => {
		var nine = [520, 521, 522, 531];
		var ten = [500, 501, 502, 503, 504];
		var fifty = [701, 711, 721, 731, 741, 751, 761, 762, 771, 781];
		var link = "";
		if (this.state.main == "thunderstorm") {
			this.setState({ link: "http://openweathermap.org/img/wn/11d@2x.png" });
		} else if (this.state.main == "Drizzle" || nine.includes(this.state.id)) {
			this.setState({ link: "http://openweathermap.org/img/wn/09d@2x.png" });
		} else if (fifty.includes(this.state.id)) {
			this.setState({ link: "http://openweathermap.org/img/wn/50d@2x.png" });
		} else if (ten.includes(this.state.cond)) {
			this.setState({ link: "http://openweathermap.org/img/wn/10d@2x.png" });
		} else if (
			this.state.main == "Snow" ||
			this.state.cond == "freezing rain"
		) {
			this.setState({ link: "http://openweathermap.org/img/wn/13d@2x.png" });
		} else if (this.state.id == 800) {
			if (this.state.time > 18) {
				this.setState({ link: "http://openweathermap.org/img/wn/01n@2x.png" });
			} else {
				this.setState({ link: "http://openweathermap.org/img/wn/01d@2x.png" });
			}
			return link;
		} else if (this.state.id == 801) {
			if (this.state.time > 18) {
				this.setState({ link: "http://openweathermap.org/img/wn/02n@2x.png" });
			} else {
				this.setState({ link: "http://openweathermap.org/img/wn/02d@2x.png" });
			}
			return link;
		} else if (this.state.id == 802) {
			if (this.state.time > 18) {
				this.setState({ link: "http://openweathermap.org/img/wn/03n@2x.png" });
			} else {
				this.setState({ link: "http://openweathermap.org/img/wn/03d@2x.png" });
			}
			return link;
		} else if (this.state.id == 803 || this.state.id == 804) {
			if (this.state.time > 18) {
				this.setState({ link: "http://openweathermap.org/img/wn/04n@2x.png" });
			} else {
				this.setState({ link: "http://openweathermap.org/img/wn/04d@2x.png" });
			}
		}
	};

	coordsplit = (result) => {
		var lats = result[0]["lat"];
		var long = result[0]["lon"];
		this.setState({ latitude: lats });
		this.setState({ longitude: long });

		fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.latitude}&lon=${this.state.longitude}&units=metric&appid=${this.props.API_Key}`
		)
			.then((res) => res.json())
			.then((data) => this.find(data));
	};

	forecast = () => {
		fetch(
			`http://api.openweathermap.org/geo/1.0/direct?q=${this.props.locate}&limit=5&appid=${this.props.API_Key}`
		)
			.then((res) => res.json())
			.then((result) => this.coordsplit(result));
	};

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp
			? `${style.temperature} ${style.filled}`
			: style.temperature;
		const getinput = (event) => {
			const loc = event.target.value;
			this.fetchWeatherData(loc);
		};
		const uptime = () => {
			if (this.state.uptimer < 48) {
				if (this.state.time == 23) {
					this.setState({ day: this.state.day + 1 });
					this.setState({ time: 0 });
					this.setState({ uptimer: this.state.uptimer + 1 });
					this.forecast();
				}
				this.setState({ time: this.state.time + 1 });
				this.setState({ uptimer: this.state.uptimer + 1 });
				this.forecast();
				console.log(this.state.uptimer);
			}
		};

		const downtime = () => {
			if (this.state.uptimer == 1) {
				this.setState({ time: this.state.time - 1 });
				this.setState({ uptimer: this.state.uptimer - 1 });
				this.fetchWeatherData(this.props.locate);
			} else if (this.state.uptimer > 0) {
				if (this.state.time == 0) {
					this.setState({ day: this.state.day - 1 });
					this.setState({ time: 24 });
					this.setState({ uptimer: this.state.uptimer - 1 });
					this.forecast();
				}
				this.setState({ time: this.state.time - 1 });
				this.setState({ uptimer: this.state.uptimer - 1 });
				this.forecast();

				console.log(this.state.uptimer);
			}
		};

		const forwardDate = () => {
			console.log(this.state.upcount);
			if (this.state.upcount < 1) {
				this.setState({ day: this.state.day + 1 });
				this.setState({ upcount: this.state.upcount + 1 });
				this.setState({ uptimer: this.state.uptimer + 24 });
				this.props.DTUpdate(1);
				this.forecast();
			}
		};

		const bacwardDate = () => {
			if (this.state.upcount > 1) {
				this.setState({ day: this.state.day - 1 });
				this.setState({ upcount: this.state.upcount - 1 });
				this.setState({ uptimer: this.state.uptimer - 24 });
				this.props.DTUpdate(0);
				this.forecast();
			} else if (this.state.upcount == 1) {
				this.setState({ day: this.state.day - 1 });
				this.setState({ upcount: this.state.upcount - 1 });
				this.setState({ uptimer: this.state.uptimer - 24 });
				this.props.DTUpdate(0);
				this.fetchWeatherData(this.props.locate);
			}
		};

		// display all weather data
		return (
			<div class={style.container}>
				<div class={style.header}>
					<div class={style.city}>{this.props.locate}</div>
					<div class={style.conditions}>{this.state.cond}</div>
					<span class={tempStyles}>{this.state.temp}</span>
				</div>

				<div class={style.searchBox}>
					<input
						id="loc_input"
						type="text"
						class="search"
						placeholder="Location"
						onChange={getinput}
					/>
				</div>
				<div>
					{this.state.display ? (
						<img
							type="button"
							onClick={bacwardDate}
							src="../../assets/arrows/up.png"
							class={style.bacwardDate}
							width={53}
							height={20}
						></img>
					) : null}
					{this.state.display ? (
						<img
							type="button"
							class={style.weatherImage}
							src={this.state.link}
							width={150}
							height={150}
							onClick={this.props.toggleScreen}
						></img>
					) : null}
					{this.state.display ? (
						<img
							type="button"
							onClick={forwardDate}
							src="../../assets/arrows/up.png"
							class={style.forwardDate}
							width={53}
							height={20}
						></img>
					) : null}
				</div>
				<div class={style.timesetter}>
					{this.state.display ? (
						<img
							type="button"
							onClick={uptime}
							src="../../assets/arrows/up.png"
							class={style.uparrow}
							width={53}
							height={20}
						></img>
					) : null}
					{this.state.display ? (
						<p class={style.timeName}>{this.state.time} : 00</p>
					) : null}
					{this.state.display ? (
						<img
							type="button"
							onClick={downtime}
							src="../../assets/arrows/down.png"
							class={style.downarrow}
							width={53}
							height={20}
						></img>
					) : null}
				</div>
				<div>
					{this.state.display ? (
						<img
							type="button"
							onClick={this.voice}
							class={style.sound}
							width={55}
							height={55}
						></img>
					) : null}
				</div>
				<div>
					{this.state.display ? (
						<img
							type="button"
							class={style.magnify}
							width={25}
							height={25}
						></img>
					) : null}
					{this.state.display ? (
						<img
							type="button"
							class={style.minimise}
							width={25}
							height={25}
						></img>
					) : null}
				</div>
			</div>
		);
	}

	parseResponse = (parsed_json) => {
		var location = parsed_json["name"];
		var temp_c = parsed_json["main"]["temp"];
		var conditions = parsed_json["weather"]["0"]["description"];
		var idTaken = parsed_json["weather"]["0"]["id"];
		var main_weath = parsed_json["weather"]["0"]["main"];
		var timez = parsed_json["timezone"];
		
		console.log(unix);
		this.props.updateLocation(location);
		console.log(parsed_json);
		var unix = Math.round(+new Date()/1000);
		console.log(unix);
		var date = new Date((unix+timez)*1000);
		
		this.setState({
			temp: temp_c.toFixed(),
			cond: conditions,
			id: idTaken,
			main: main_weath,
			time: new Date(date).getHours(),
			day: new Date(date).getDate(),
			month: new Date(date).getMonth(),
			year: new Date(date).getFullYear(),
		});
		console.log(this.state.year + '/' + (this.state.month + 1) + '/' + this.state.day + ' ' + this.state.time);
		this.iconrec();
	};

	componentDidMount() {
		if (this.props.locate) {
			this.props.DTUpdate(0);
			this.fetchWeatherData(this.props.locate);
		}
	}
}