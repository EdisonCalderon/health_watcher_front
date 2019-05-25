import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody } from "shards-react";
import Chart from "../../utils/chart2";
import io from 'socket.io-client';

class Sensor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            index : 0,
            lineChartData: {
                labels: [],
                datasets: [
                    {
                        type: "line",
                        label: "Pulso",
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
            },
            metadata: this.props.metadata
        }

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const { metadata } = this.state
        const socket = io(`/${metadata.context}_${metadata.id}`)
        socket.on('measurement', measurement => {
            const insertIntoDataset = (datasets, index, value) => { return datasets[index].data.push(value) && datasets }
            this.setState((state, props) => ({
                lineChartData: {
                    ...state.lineChartData,
                    datasets: insertIntoDataset(state.lineChartData.datasets, state.index, measurement.value),
                    labels: [...state.lineChartData.labels, measurement.timestamp]
                }
            }))
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
    title: PropTypes.string,
    metadata: PropTypes.object
};

Sensor.defaultProps = {
    title: "Pulsómetro"
};

export default Sensor;
