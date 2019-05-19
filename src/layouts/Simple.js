import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainFooter from "../components/layout/MainFooter";

const DefaultLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
      <Col
        className="main-content p-0"
        lg={{ size: 6, offset: 3 }}
        md={{ size: 8, offset: 2 }}
        sm="12"
        tag="div"
      >
        {children}
        {!noFooter && <MainFooter />}
      </Col>
    </Row>
  </Container>
);

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

DefaultLayout.defaultProps = {
  noNavbar: true,
  noFooter: false
};

export default DefaultLayout;
