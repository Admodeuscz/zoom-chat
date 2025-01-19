import React, { useState } from 'react';
import { Button, Input, Row, Col, Form } from "reactstrap";

function ChatInput(props) {
    const [textMessage, settextMessage] = useState("");
    const [file, setfile] = useState({
        name: "",
        size: ""
    });
    const [fileImage, setfileImage] = useState("")


    //function for text input value change
    const handleChange = e => {
        settextMessage(e.target.value);
    }

    const onaddMessage = (e, textMessage) => {
        e.preventDefault();
        if (textMessage !== "") {
            props.onaddMessage(textMessage, "textMessage");
            settextMessage("");
        }

        if (file.name !== "") {
            props.onaddMessage(file, "fileMessage");
            setfile({
                name: "",
                size: ""
            })
        }

        if (fileImage !== "") {
            props.onaddMessage(fileImage, "imageMessage");
            setfileImage("")
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onaddMessage(e, textMessage);
        }
    };

    return (
        <React.Fragment>
            <div className="chat-input-section p-3 p-lg-4 border-top mb-0 ">
                <Form onSubmit={(e) => onaddMessage(e, textMessage)} >
                    <Row className='g-0'>
                        <Col>
                            <div>
                                <Input 
                                    type="text" 
                                    value={textMessage} 
                                    onChange={handleChange} 
                                    onKeyPress={handleKeyPress}
                                    className="form-control form-control-lg bg-light border-light" 
                                    placeholder="メッセージを入力..." 
                                />
                            </div>
                        </Col>
                        <Col xs="auto">
                            <div className="chat-input-links ms-md-2">
                                <ul className="list-inline mb-0 ms-0">
                                    <li className="list-inline-item">
                                        <Button type="submit" color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light">
                                            <i className="ri-send-plane-fill fs-4"></i>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </React.Fragment>
    );
}

export default ChatInput;