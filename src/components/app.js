// import preact
import { h, Component } from "preact";

// import required Components from 'components/'
import ExpIphone from "./E_iphone";
import Iphone from "./iphone";
import Ipad from "./ipad";
import $ from "jquery";

export default class App extends Component {
	state = {
		API_Key: "990d4575585b853119bef3936de82611",
		childVis: false,
		startupComplete: false,
		locate: "",
	};

	fetchCurrentLocation = () => {
		const successCallback = (position) => {
			var crd = position.coords;
			var lon = crd.longitude;
			var lat = crd.latitude;

			var url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${this.state.API_Key}`;
			$.ajax({
				url: url,
				dataType: "jsonp",
				success: this.parseResponse,
				error: function (req, err) {
					console.log("API call failed " + err);
				},
			});
			// once the data grabbed, hide the button
			this.setState({ display: false });
		};
		const errorCallback = (error) => {
			console.error(error);
		};
		const location = navigator.geolocation.getCurrentPosition(
			successCallback,
			errorCallback
		);
	};

	parseResponse = (parsed_json) => {
		var city = parsed_json["name"];
		console.log(parsed_json);
		let input = document.getElementById("loc_input");
		input.value = city;
		this.setState({
			locate: city,
		});
		console.log("APp:" + this.state.locate);
	};
	//var App = React.createClass({

	// once the components are loaded, checks if the url bar has a path with "ipad" in it, if so sets state of tablet to be true
	componentDidMount() {
		const urlBar = window.location.href;
		if (urlBar.includes("ipad")) {
			this.setState({
				isTablet: true,
			});
		} else {
			this.setState({
				isTablet: false,
			});
		}
	}

	toggleChild = () => {
		this.setState({
			childVis: !this.state.childVis,
		});
	};

	/*
		A render method to display the required Component on screen (iPhone or iPad) : selected by checking component's isTablet state
	*/
	render() {
		//this.fetchCurrentLocation();
		if (this.state.isTablet) {
			return (
				<div id="app">
					<Ipad />
				</div>
			);
		} else {
			return (
				<div id="app">
					{this.state.childVis ? (
						<ExpIphone
							locate={this.state.locate}
							toggleScreen={this.toggleChild}
							API_Key={this.state.API_Key}
						/>
					) : (
						<Iphone
							locate={this.state.locate}
							toggleScreen={this.toggleChild}
							API_Key={this.state.API_Key}
							startupCheck={this.state.startupComplete}
							startupUpdate={() => {
								this.setState({
									startupComplete: !this.state.startupComplete,
								});
							}}
							fetchCurrentLocation={this.fetchCurrentLocation}
							updateLocation={(location) => {
								this.setState({
									locate: location,
								});
							}}
						/>
					)}
				</div>
			);
		}
	}
}
