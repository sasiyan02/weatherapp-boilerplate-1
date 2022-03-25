// import preact
import { h, Component } from "preact";

// import required Components from 'components/'
import ExpIphone from "./E_iphone";
import Iphone from "./iphone";
import Ipad from "./ipad";
import $ from "jquery";

export default class App extends Component {
	//var App = React.createClass({

	//Assign states to fields which will be utilized later on
	state = {
		//API key state utilized in api calls to retrieve weather data
		API_Key: "a0fc459adad52f03a23991ac301ce7c4",
		//page display state
		childVis: false,
		//location state
		locate: "",
		//day change state
		day: 0,
	};

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

	// set the state which will be used later on, in which page should be rendered
	toggleChild = () => {
		this.setState({
			childVis: !this.state.childVis,
		});
	};

	// set the state for the difference in days from current day
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
		if (this.state.isTablet) {
			return (
				<div id="app">
					<Ipad />
				</div>
			);
		} else {
			return (
				<div id="app">
					{
						// conditional operator which determines which page should be loaded
						// state components passed on to external pages to be used later on
					}
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
