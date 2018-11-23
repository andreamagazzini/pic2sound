import React from 'react';
import {Button, Col, Row} from "react-bootstrap";

import { chords } from './files-uploader';


export default class Webcam extends React.PureComponent {
    state = {
        videoSrc: null,
    };

    componentDidMount() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, this.handleVideo, this.videoError);
        }
    }

    handleVideo = (stream) => {
        // Update the state, triggering the component to re-render with the correct stream
        this.setState({videoSrc: window.URL.createObjectURL(stream)});
    };

    videoError = () => {

    };

    b64toBlob = (data, sliceSize) => {
        const block = data.split(";");

        // Get the content type of the image
        const contentType = block[0].split(":")[1];

        // get the real base64 content of the file
        const b64Data = block[1].split(",")[1];

        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    };

    takePhoto = (event) => {
        const nPhotos = 50;

        const canvas = document.querySelector('canvas');
        const context = canvas.getContext('2d');
        let video = document.getElementById('video');
        const width = video.videoWidth;
        const height = video.videoHeight;
        canvas.width = width;
        canvas.height = height;

        if (event.currentTarget.value === 'test') {
            this.timer = setInterval(() => {
                video = document.getElementById('video');
                context.drawImage(video, 0, 0, width, height);

                const formData = new FormData();
                const data = canvas.toDataURL('image/png');

                formData.append('path', 'test');

                // Convert it to a blob to upload
                const blob = this.b64toBlob(data);

                formData.append('0', blob, `${new Date().toString()}.png`);

                this.props.uploadFiles(formData);
            }, 1000);
        } else {
            for (let i = 0; i < nPhotos; i++) {
                video = document.getElementById('video');
                context.drawImage(video, 0, 0, width, height);

                const formData = new FormData();
                const data = canvas.toDataURL('image/png');

                formData.append('path', event.currentTarget.value);

                // Convert it to a blob to upload
                const blob = this.b64toBlob(data);

                formData.append('0', blob, `${new Date().valueOf()}.png`);

                this.props.uploadFiles(formData);
            }
        }
    };

    stopStreaming = () => {
        clearInterval(this.timer);
        this.timer = null;
    };

    render() {
        return (
            <Row>
                <Col md={6}>
                    <video id="video" src={this.state.videoSrc} autoPlay="true"/>
                    <canvas id="canvas"
                            hidden
                    />
                </Col>
                <Col md={6}>
                    <Row>
                    {
                        chords.map((chord, key) =>
                            <Col md={6} key={key}>
                                {
                                    this.props.data[chord] > 0 &&
                                    <div
                                        style={{width: (this.props.data[chord] < 50 ?
                                                Math.round(this.props.data[chord]*2) : 100) + '%'}}
                                        className={'load-bar'}
                                    />
                                }
                                <Button className={'btn-webcam btn btn-lg btn-warning'} value={chord} onClick={this.takePhoto}>
                                    {chord}{this.props.data[chord] > 0 && `(${this.props.data[chord]})`}
                                </Button>
                            </Col>)
                    }
                    </Row>
                    <Button value={'test'} className={'btn-webcam btn btn-lg btn-success'} onClick={this.takePhoto}>
                        Test
                    </Button>
                    <Button value={'stop'} className={'btn-webcam btn btn-lg btn-danger'} onClick={this.stopStreaming}>
                        Stop
                    </Button>
                </Col>
            </Row>
        )
    }
}