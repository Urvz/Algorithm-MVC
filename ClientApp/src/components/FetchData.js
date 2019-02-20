import React, { Component } from 'react';

export class FetchData extends Component {
	static displayName = FetchData.name;

	constructor(props) {
		super(props);
		this.state = {
			userArray: [],
			sort: 0,	//sort type 0=merge sort, 1=quick sort, 2=bubble sort
			sortType: 'Merge Sort',
			input: 0,	//input type
			inputType: 'Int',
			result: 'Press submit to see your sorted Array here!',  //result array
			comment: '' //details of the submission

		};	
		this.handleTextChange = this.handleTextChange.bind(this);  //bind all methods to prevent looping
		this.handleSubmit = this.handleSubmit.bind(this);
		this.sortMethod = this.sortMethod.bind(this);
	}

	componentDidMount() {
		console.log(' A few comments: Input value can take 500 single digit values(for now).I tried to use !this.state.userArray.some(isNaN) to see if the input is truely just integers, but I was getting an error saying some is not a function, with more time I could solve this. I was unable to account for double, int or string in my method. I tried to bugfix with using dynamic instead but changing int-long values did not let that happen so I ran out of time. I was also unable to show the steps due to the methods in the surver overwritting my jagged array. I would love to talk about these issues with you, other than that everything else is working fine! Thank you for considering me and this project will be a great addition to my portfolio.');
	}

	sortMethod(option, sort) {	//updates state for sort type
		this.setState({ sort: option, sortType: sort }, () => {
			console.log(this.state.sort + " " + this.state.sortType);
		});
	}

	inputMethod(option, input) {	//updates state for input type
		this.setState({ input: option, inputType: input }, () => {
			console.log(this.state.input + " " + this.state.inputType);
		});
	}

	handleTextChange(e) {	//updates userarray value
		this.setState({ userArray: e.target.value });
	}

	handleSubmit(e) {	//sends a POST request to the server
		e.preventDefault();
		//if (!this.state.userArray.some(isNaN)) {
			const userArray = JSON.parse("[" + this.state.userArray + "]");
		//}
		const sort = this.state.sort;
		const input = this.state.input;
		const inputType = this.state.inputType;
		console.log("now user input" + userArray)
		// TODO: send request to the server
		fetch('api/SortAlgorithm/Searchs', {
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ userArray: userArray, sort: sort, input: input })	//sending the array, method of sorting and input type
		})
			.then((res) => res.json())
			.then((data) => {			//update the state after the server has finished changing the array 
				console.log(data);
				this.setState({ result: data.inputs })
				if (data.sortMethod === 0) {
					this.setState({ comment: ' is your result using Merge Sort with input type as ' + inputType })
				} else if (data.sortMethod === 1) {
					this.setState({ comment: ' is your result using Quick Sort with input type as ' + inputType})
				} else {
					this.setState({ comment: ' is your result using Bubble Sort with input type as ' + inputType})
				}
			}).catch(function () {
				this.setState({ comment: ' you have entered the array incorrectly. Please enter it like this: 4,3,2,1 '});
			});
	}

	render() {

		return (
			<div className='text-center'>
				<h1>Sorting Algorithms</h1>
				<p>This component demonstrates posting a user-entered array to the server, and fetching the sorted algorithm from the server.</p>
				<div className="dropdown">
					<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{this.state.sortType}
					</button>
					<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<a className="dropdown-item" onClick={() => this.sortMethod(0, "Merge Sort")}>Merge Sort</a>
						<a className="dropdown-item" onClick={() => this.sortMethod(1, "Quick Sort")}>Quick Sort</a>
						<a className="dropdown-item" onClick={() => this.sortMethod(2, "Bubble Sort")}>Bubble Sort</a>
					</div>
				</div>
				<br />
				<div className="dropdown">
					<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{this.state.inputType}
					</button>
					<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<a className="dropdown-item" onClick={() => this.inputMethod(0, "Int")}>Int</a>
						<a className="dropdown-item" onClick={() => this.inputMethod(1, "Double")}>Double</a>
						<a className="dropdown-item" onClick={() => this.inputMethod(2, "String")}>String</a>
					</div>
				</div>
				<br />
				<form className="form" onSubmit={this.handleSubmit}>
					<div className="form-group ">
						<input type="text" className="form-control" minLength="1" maxLength="999" placeholder="Enter your array here, separated by a Comma ex:1,4,2,3,6" onChange={this.handleTextChange.bind(this)} />
					</div>
					<button type="submit" className="btn btn-primary mb-12">Submit</button>
				</form>
				<h1 className="display-4">{this.state.result}  {this.state.comment}</h1>
			</div>
		);
	}
}
