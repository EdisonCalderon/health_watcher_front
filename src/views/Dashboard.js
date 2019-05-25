import { Redirect } from 'react-router-dom';
import Axios from "axios"
import React from "react"
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react"
import { isLoggedIn } from '../utils/auth'

import ContextSelector from "./../components/dashboard/ContextSelector";
import SmallStats from "./../components/common/SmallStats";
import Sensor from "./../components/dashboard/Sensor";

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  changeContext = async (context) => {
    this.setState({ context: null })
    const baseURL = process.env.REACT_APP_API_URL || ""
    let context_detail = (await Axios.get(`${baseURL}/context/${context.value}`)).data
    this.setState({ context: context_detail })
  }

  render() {
    if (!isLoggedIn()) return <Redirect to="/login" />; 
    const { smallStats } = this.props
    const { context } = this.state
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <ContextSelector changeContext={this.changeContext} />
        </Row>

        <Row>
          {smallStats.map((stats, idx) => (
            <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
              <SmallStats
                id={`small-stats-${idx}`}
                variation="1"
                chartData={stats.datasets}
                chartLabels={stats.chartLabels}
                label={stats.label}
                value={stats.value}
                percentage={stats.percentage}
                increase={stats.increase}
                decrease={stats.decrease}
              />
            </Col>
          ))}
        </Row>

        <Row>
          {
            context && context.sensors.map((sensor, i) => {
              return  <Col lg="6" md="12" sm="12" className="mb-4" key={i}>
                <Sensor metadata={{context: context.id,  ...sensor}} />
              </Col>
            })
          }
        </Row>
      </Container>
    )
  }
}
Dashboard.propTypes = {
  smallStats: PropTypes.array
};

Dashboard.defaultProps = {
  smallStats: [
    {
      label: "Sensores",
      value: "1"
    },
    {
      label: "Actuadores",
      value: "0"
    },
    {
      label: "Estado",
      value: "Activo"
    },
    {
      label: "Alertas",
      value: "0"
    }
  ]
};

export default Dashboard;
