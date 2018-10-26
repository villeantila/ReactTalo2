import React, { Component } from 'react';
import axios from 'axios';

export class Counter extends Component {
    displayName = Counter.name

    constructor(props) {
        super(props);
        this.state = {
            currentCount: 0,
            talonTiedot: []

        };

        this.incrementCounter = this.incrementCounter.bind(this);
    }

    incrementCounter() {
        this.setState({
            currentCount: this.state.currentCount + 1
        });
        const id = 11;
        axios
            .get('api/TalonTiedot/' + id)
            .then(x => {
                //console.log(x.data);
                this.setState({
                    talonTiedot: x.data
                });
            });

        const taloId = 11;
        const talonTavoitelampotila = 28;
        let url = 'api/Talot/Muokkaa?taloId=' + taloId + '&talonTavoitelampotila=' + talonTavoitelampotila;
        console.log(url);
        axios
            .post(url)
            .then(x => {

                //console.log(x);
            });
    }

    render() {
        return (
            <div>
                <h1>Counter</h1>

                <p>This is a simple example of a React component.</p>

                <p>Current count: <strong>{this.state.currentCount}</strong></p>

                <button onClick={this.incrementCounter}>Increment</button>
            </div>
        );
    }
}
