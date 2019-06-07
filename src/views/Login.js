import React from "react";
import { Redirect } from 'react-router-dom';
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Col,
  Form,
  FormGroup,
  FormInput,
  Button
} from "shards-react";
import { login, isLoggedIn } from '../utils/auth'

import "../assets/login.css";


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = (event) => {
    const target = event.target;
    this.setState({ [target.id]: target.value });
  }

  submitLogin = () => {
    const { username, password } = this.state
    login(username, password)
  }

  render() {
    const { username, password } = this.state;
    if (isLoggedIn()) return <Redirect to="/" />;
    return (
      <Card className="login mb-4" >
        <CardHeader className="border-bottom">
          <h5 className="m-0">Ingreso</h5>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Form onSubmit={this.submitLogin}>
              <FormGroup>
                <label htmlFor="username">Usuario</label>
                <FormInput required id="username" value={username} onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="password">Contraseña</label>
                <FormInput required id="password" type="password" value={password} onChange={this.handleChange} />
              </FormGroup>
              <Col sm="" md={{ size: 6, offset: 3 }}>
                <Button type="submit" block theme="accent">Ingresar</Button>
              </Col>
            </Form>
          </ListGroupItem>
        </ListGroup>
      </Card>
    )
  }
}

export default Login;
