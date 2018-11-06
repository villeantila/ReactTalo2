import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
//import { NavMenu } from './NavMenu';

export class Layout extends Component {
  displayName = Layout.name

  render() {
    return (
      <Grid fluid>
        <Row>

          <Col sm={12}>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    );
  }
}


//<Col sm={3}>
//    <NavMenu />
//</Col>