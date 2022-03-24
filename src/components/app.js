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
		dt: "",
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
							dt={this.state.dt}
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
							DTUpdate={(dt) => {
								this.setState({
									dt: dt,
								});
							}}
						/>
					)}
				</div>
			);
		}
	}
}
