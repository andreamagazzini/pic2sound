import React from 'react';
import {Col, Row} from "react-bootstrap";

export const chords = ['C', 'A', 'G', 'E', 'D', 'Am', 'Em', 'Dm', 'Snare', 'Electro', 'Crash', 'Beer'];

export default class FilesUploader extends React.PureComponent {
    state = {
        uploading: false
    };

    handleTrainFilesUpload = (event) => {
        const files = Array.from(event.target.files);
        this.setState({uploading: true});

        const formData = new FormData();
        formData.append('path', event.currentTarget.id);

        files.forEach((file, i) => {
            formData.append(i, file)
        });

        this.props.uploadFiles(formData);
    };

    handleTestFileUpload = (event) => {
        const file = event.currentTarget.files[0];
        this.setState({uploading: true});

        const formData = new FormData();
        formData.append('path', event.currentTarget.id);
        formData.append('file', file);

        this.props.uploadFiles(formData);
    };

    render() {
        return (
            <Row>
                <Col md={6}>
                    <Row>
                        {
                            chords.map((chord, key) =>
                                <Col md={3} key={key}>
                                    <input type={'file'} id={chord} onChange={this.handleTrainFilesUpload} multiple/>
                                    <label htmlFor={chord} className={'btn btn-lg btn-warning'}>
                                        {chord}
                                    </label>
                                </Col>)
                        }
                    </Row>
                </Col>
                <Col md={6}>
                    <input type={'file'} id={'test'} onChange={this.handleTestFileUpload}/>
                    <label htmlFor={'test'} className={`btn btn-lg btn-danger`}>Test</label>
                </Col>
            </Row>
        )
    }
}