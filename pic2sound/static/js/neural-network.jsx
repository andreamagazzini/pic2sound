import React from "react";
import {Button, Row, Col} from "react-bootstrap";

import Webcam from "./webcam";
import FilesUploader from './files-uploader';

const url = 'https://autochords.com/assets/audio/guitar';

const chords = {
    C: `${url}/1050.major.mp3`,
    A: `${url}/627.major.mp3`,
    G: `${url}/704.major.mp3`,
    E: `${url}/837.major.mp3`,
    D: `${url}/940.major.mp3`,
    Am: `${url}/627.minor.mp3`,
    Em: `${url}/837.minor.mp3`,
    Dm: `${url}/940.minor.mp3`,
    Snare: `http://cdn.mos.musicradar.com/audio/samples/drum-demo-samples/CYCdh_K4-Snr05.mp3`,
    Electro: `http://cdn.mos.musicradar.com/audio/samples/drum-demo-samples/CYCdh_ElecK01-Kick02.mp3`,
    Crash: `http://cdn.mos.musicradar.com/audio/samples/drum-demo-samples/CYCdh_Crash-03.mp3`,
    Beer: 'http://thebeautybrains.com/wp-content/uploads/podcast/soundfx/pourbeer.wav'
};

export default class NeuralNetwork extends React.Component {
    state = {
        result: 'Upload data',
        data: {},
        uploading: false,
    };

    componentDidMount() {
        this.countFiles();
    }

    countFiles = () => {
        fetch(`${window.location.href}count-files`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
                if(Object.keys(data).length > 1){
                    this.setState({result: 'Train model'})
                }
                this.setState({data})
            });
    };

    uploadFiles = (formData) => {
        fetch(`${window.location.href}upload-files`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(response => {
                if(typeof response === 'string'){
                    const chord = response.split(':')[0];
                    this.playSound(chord);
                    this.setState({result: response});
                } else {
                    this.setState({data: response})
                }
            });
    };

    trainNetwork = () => {
        if(Object.keys(this.state.data).length < 2) return;

        fetch(`${window.location.href}train-network`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({result: 'Test the model'}));
    };

    resetModel = () => {
        this.setState({result: 'Train the model'});
        fetch(`${window.location.href}reset-model`, {
            method: 'GET'
        })
            .then(res => res.json());
    };

    resetData = () => {
        this.setState({result: 'Upload data'});
        fetch(`${window.location.href}reset-data`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({data}));
    };

    async playSound(chord) {
        document.getElementsByName(chord)[0].play();
    };

    render() {
        return (
            <div className={'container'}>
                {
                    Object.keys(chords).map((key, index) =>
                        <audio name={key} src={chords[key]} key={index} autoPlay />
                    )
                }
                <Row>
                    <Col md={2}>
                        <Button className={`btn btn-lg btn-success`} onClick={this.trainNetwork}>
                            Train
                        </Button>
                    </Col>
                    <Col md={2}>
                        <Button value={false} className={`btn btn-lg btn-danger`} onClick={this.resetModel}>
                            Reset Model
                        </Button>
                    </Col>
                    <Col md={2}>
                        <Button value={false} className={`btn btn-lg btn-danger`} onClick={this.resetData}>
                            Reset Data
                        </Button>
                    </Col>
                    <Col md={6}>
                        <div className={'show-result'}>{this.state.result}</div>
                    </Col>
                </Row>
                <h3>Upload from webcam</h3>
                <Webcam data={this.state.data} uploadFiles={this.uploadFiles} />
                <h3>Upload from file</h3>
                <FilesUploader data={this.state.data} uploadFiles={this.uploadFiles} />
            </div>
        );
    }
}
