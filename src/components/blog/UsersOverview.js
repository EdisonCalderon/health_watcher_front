import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody } from "shards-react";
import Chart from "../../utils/chart2";

class UsersOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "BTC-USD",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(0,123,255,0.9)",
            pointBackgroundColor: "rgba(0,123,255,0.9)",
            pointBorderColor: "rgba(0,123,255,0.9)",
            borderWidth: 2,
            lineTension: 0.45,
            data: []
          }
        ]
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          enabled: true
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          ]
        }
      }
    }

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["BTC-USD"]
        }
      ]
    };

    this.ws = new WebSocket("wss://ws-feed.gdax.com");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscribe));
    };

    this.ws.onmessage = e => {
      const value = JSON.parse(e.data);
      if (value.type !== "ticker") {
        return;
      }

      const oldBtcDataSet = this.state.lineChartData.datasets[0];
      const newBtcDataSet = { ...oldBtcDataSet };
      newBtcDataSet.data.push(value.price);

      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newBtcDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      this.setState({ lineChartData: newChartData });
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    const { title } = this.props;
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="pt-0">
          <Chart
            data={this.state.lineChartData}
            options={this.state.lineChartOptions}
          />
        </CardBody>
      </Card>
    );
  }
}

UsersOverview.propTypes = {
  title: PropTypes.string
};

UsersOverview.defaultProps = {
  title: "Ejemplo Bitcoin"
};

export default UsersOverview;
