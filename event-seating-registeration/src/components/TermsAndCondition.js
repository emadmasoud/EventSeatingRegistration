import React, { Component } from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap';
import SeatPicker from 'react-seat-picker'
import { BASE_URL } from '../Config'
import { ToastsStore } from 'react-toasts';
import axios from 'axios';
export default class SeatPlanner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor lorem at purus finibus suscipit. Vestibulum ac diam risus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n Pellentesque eu magna et nunc pulvinar interdum. In hac habitasse platea dictumst. In condimentum lectus in risus gravida accumsan. Donec sed urna a odio ultricies tincidunt.Suspendisse eget quam placerat, commodo tellus eget, placerat felis. Donec feugiat, ante ac interdum vulputate, enim nisl imperdiet quam, a euismod lacus enim nec tortor. Pellentesque nec magna sit amet elit mollis viverra. Maecenas vitae pharetra risus. Nulla sagittis vehicula lacus id congue. Integer auctor semper neque in blandit. Vestibulum elementum posuere ex, et vestibulum leo facilisis eget. Etiam sit amet odio maximus, faucibus nisi vel, fringilla justo. Praesent luctus felis aliquet eros iaculis, vitae eleifend sem viverra. In finibus nunc non malesuada aliquam. Donec ornare dapibus augue, vel laoreet libero rutrum et.Nullam sed elit non sapien lobortis blandit id nec ex. Etiam vitae felis lobortis, ullamcorper purus ac, sodales leo. Praesent porttitor lectus purus. Donec in rutrum tortor. Donec pharetra at quam non facilisis. Donec feugiat laoreet sem, in sollicitudin diam rhoncus non. Cras pharetra sit amet eros in varius. Etiam faucibus libero arcu, lacinia lacinia est porta sed. Nullam et dolor sed ante varius porta a vitae ligula. Integer at massa mattis, fringilla ipsum eget, molestie ex. Integer convallis, turpis eu eleifend mattis, nunc sapien tincidunt dolor, at dignissim nibh eros at elit. Cras enim eros, vulputate id mollis nec, sollicitudin vitae dolor. Ut ut venenatis sapien. Sed sit amet lacus viverra, laoreet mi a, dictum magna. Vestibulum nec odio nulla. Nam semper tellus ac congue iaculis.Mauris non accumsan mi. Phasellus porttitor ut neque vel posuere. Proin auctor turpis quam, sed lacinia neque suscipit vel. Donec scelerisque egestas ante, vel sodales lorem blandit tristique. Praesent vitae lobortis orci, id ullamcorper est. Praesent tempus consectetur mauris a ultricies. Praesent sodales auctor magna a sagittis. Phasellus dignissim viverra justo at tristique. Morbi egestas elit eu lacinia pharetra. Aliquam maximus, leo a viverra viverra, tellus magna malesuada ipsum, id viverra sapien ipsum eget ex.Mauris non mauris mollis, feugiat arcu vel, cursus orci. Nunc id vestibulum ex. Fusce tempor non lectus vitae imperdiet. Vivamus aliquam bibendum nisl id tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed dapibus, dolor eu efficitur rhoncus, tellus neque blandit diam, vel fermentum mi velit ullamcorper ipsum. Ut nec purus vel quam fermentum tristique. Nullam non mi efficitur, placerat velit vel, tincidunt leo. Donec sed maximus dolor. Nullam condimentum feugiat dolor eget pharetra. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum vel ultrices nibh. Aenean vulputate iaculis metus et varius. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc sagittis lacus in pellentesque ullamcorper. Aenean lobortis elementum dapibus",
            agreed: '',
            text: ''

        }
    }

    componentWillMount() {
        axios.get(BASE_URL+"getPrivacyPolicyText").then(response=>{
            if(response.data.success)
            {
                this.setState({text: response.data.data})
            }
        })
    }

    onValueChangeHandler = e => {
        console.log(e.target.checked)
        this.setState({ [e.target.name]: e.target.checked })
    }

    GoToregisterUser = e => {
       
    }
    render() {

        return (
            <form action="/register">
                <Row>
                    <Col >
                        <div className="terms">
                            <h3 className="text-center">Terms and Condition</h3>
                            {this.state.text}
                            <hr />
                            <div>
                                <input type="checkbox"
                                    required
                                    checked={this.state.agreed}
                                    name='agreed'
                                    onChange={this.onValueChangeHandler} />
                                <span className="forgot-password text-left"> I agree to the <a href="#"> Terms & Conditions</a> mentioned by Event Planners</span>

                            </div>
                            <button type="submit" className="btn btn-primary btn-block mt-3" disabled={!this.state.agreed} onClick={this.GoToregisterUser}>Sign up</button>                  
                        </div>
                    </Col>
                </Row>
            </form>

        )
    }
}

