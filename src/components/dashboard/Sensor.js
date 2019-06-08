import React from "react"
import moment from "moment"
import 'moment/locale/es'  // without this line it didn't work
import { Card, CardHeader, CardBody } from "shards-react";
import Chart from "../../utils/chart2";
import io from 'socket.io-client';
import { toast } from 'react-toastify';
moment.locale('es')

class Sensor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            maxMeasurements: 150,
            lineChartData: {
                labels: [],
                datasets: [
                    {
                        type: "line",
                        label: props.metadata.units,
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
            metadata: this.props.metadata,
            alert: {}
        }

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const { metadata, maxMeasurements } = this.state
        const baseURL = process.env.REACT_APP_API_URL || ""
        const socket = io(`${baseURL}/${metadata.context}_${metadata.id}`)
        this.setState({ socket })
        socket.on('measurement', measurement => {
            const insertIntoDataset = (datasets, index, signal) => {
                var dataset = datasets[index].data
                if (dataset.length >= maxMeasurements) dataset.shift()
                return dataset.push(signal) && datasets
            }
            const insertIntoLabels = (labels, timestamp) => {
                var _labels = [...labels]
                if (_labels.length >= maxMeasurements) _labels.shift()
                return _labels.push(timestamp) && _labels
            }
            this.setState((state, props) => ({
                lineChartData: {
                    ...state.lineChartData,
                    datasets: insertIntoDataset(state.lineChartData.datasets, state.index, measurement.signal),
                    labels: insertIntoLabels(state.lineChartData.labels, measurement.timestamp)
                }
            }))
        })
        socket.on('anomalia', data => {
            this.setState({ alert: { has: true, color: 'yellow' } })
            setTimeout(() => this.setState({ alert: {} }), 1000 * 10)
            toast.warn(<Alert text={data} />, { autoClose: false })
        })
    }

    componentWillUnmount() {
        var { socket } = this.state
        socket.disconnect()
    }

    render() {
        const { metadata, alert } = this.state;
        const alert_properties = `5px solid ${alert.color}`
        return (
            <Card style={(alert.has) ? { border: alert_properties } : {}} small className="h-100">
                <CardHeader className="border-bottom">
                    <h6 className="m-0">{metadata.name}</h6>
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

export default Sensor;

const Alert = ({ text, closeToast }) => (
    <div onClick={closeToast}>
        <p><b>{text}</b></p>
        {moment().format("MMMM D YYYY, h:mm:ss a")}
    </div>
)
