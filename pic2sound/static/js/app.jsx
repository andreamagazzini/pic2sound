import React from "react";
import NeuralNetwork from "./neural-network";

require('../css/fullstack.css');
var $ = require('jquery');

export default class App extends React.Component {
    render () {
        return (
            <NeuralNetwork />
        );
    }
}
