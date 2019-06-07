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
    this.state = {
      smallStats: JSON.parse(JSON.stringify(props.smallStats)) 
    }
    this.baseURL = process.env.REACT_APP_API_URL || ""
  }

  changeContext = async (context) => {
    this.setState({ context: null, smallStats: JSON.parse(JSON.stringify(this.props.smallStats)) })
    let context_detail = (await Axios.get(`${this.baseURL}/context/${context.value}`)).data
    this.setState({ context: context_detail }, () => this.updateStats())
  }

  turnEnabledContext = async() => {
    var { context } = this.state 
    var new_state = !context.enabled
    await Axios.patch(`${this.baseURL}/context/${context.id}`, { enabled: new_state })
    this.setState({ context: { ...context, enabled: new_state } }, () => this.updateStats())
  }

  updateStats = () => {
    const { context, smallStats } = this.state
    smallStats[0].value = context.sensors.length
    smallStats[1].value = context.actuators.length
    smallStats[2].value = (context.enabled) ? 'Activo' : 'Inactivo'
    smallStats[2].button = { action: this.turnEnabledContext, init: context.enabled }
    this.setState({ smallStats })
  }

  render() {
    if (!isLoggedIn()) return <Redirect to="/login" />;
    const { context, smallStats } = this.state
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
                button={stats.button}
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
              return <Col lg="6" md="12" sm="12" className="mb-4" key={i}>
                <Sensor metadata={{ context: context.id, ...sensor }} />
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
      value: "0"
    },
    {
      label: "Actuadores",
      value: "0"
    },
    {
      label: "Estado",
      value: "Inactivo"
    }
  ]
};

export default Dashboard;
