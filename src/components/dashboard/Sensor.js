import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody } from "shards-react";
import Chart from "../../utils/chart2";
import io from 'socket.io-client';

class Sensor extends React.Component {
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
                            type: 'time',
                            time: {
                                unit: 'second',
                                displayFormats: {
                                    hour: 'HH:mm:ss'
                                }
                            },
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
        const socket = io('http://192.168.0.32:3002/37ed3e20-6809-41c5-9c1d-380ca2155fa8_4d075988-07df-444b-bd38-2bbf0789a607');
        socket.on('measurement', measurement => {
            const oldBtcDataSet = this.state.lineChartData.datasets[0];
            const newBtcDataSet = { ...oldBtcDataSet };
            //var value = moment().utc().seconds() % 4 === 0 ? null : value;
            newBtcDataSet.data.push(measurement.value);

            const newChartData = {
                ...this.state.lineChartData,
                datasets: [newBtcDataSet],
                labels: this.state.lineChartData.labels.concat(
                    moment(measurement.timestamp)
                )
            };
            this.setState({ lineChartData: newChartData });
        })
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

Sensor.propTypes = {
    title: PropTypes.string
};

Sensor.defaultProps = {
    title: "Ejemplo Bitcoin"
};

export default Sensor;
