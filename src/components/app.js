// import preact
import { h, Component } from "preact";

// import required Components from 'components/'
import ExpIphone from "./E_iphone";
import Iphone from "./iphone";
import Ipad from "./ipad";
import $ from "jquery";

export default class App extends Component {
	state = {
		API_Key: "a0fc459adad52f03a23991ac301ce7c4",
		childVis: false,
		startupComplete: false,
		locate: "",
		day: 0,
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

	UpdateDay = (day) => {
		let change;
		if (typeof day === "string") {
			change = 0;
		} else {
			change = this.state.day + day;
		}
		this.setState({
			day: change,
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
							day={this.state.day}
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
							DTUpdate={this.UpdateDay}
						/>
					)}
				</div>
			);
		}
	}
}
