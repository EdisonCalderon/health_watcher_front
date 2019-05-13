import React from "react";
import classNames from "classnames";
import { Col } from "shards-react";
import Axios from "axios";
import Select from 'react-select'

class ContextSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subtitle: 'Dashboard',
      isSelected: false,
      classes: classNames(
        "text-sm-left mb-3",
        "text-center",
        "text-md-left",
        "mb-sm-0"
      )
    }
  }

  async componentDidMount() {
    let contexts = (await Axios.get('/context')).data
    let options = contexts.map(x => { return { value: x.id, label: x.name } })
    this.setState({ options })
  }

  handleChange = (selected) => {
    this.setState((state, props) => ({ selected, isSelected: !state.isSelected }))
  }

  switchSelect = () => {
    this.setState((state, props) => ({ isSelected: !state.isSelected }))
  }

  render() {
    const { classes, isSelected, selected, options } = this.state;
    return (
      <Col xs="12" sm="4" className={classes} style={{zIndex: 2}}>
        <span className="text-uppercase page-subtitle">Dashboard</span>
        {(isSelected) ?
          <div>
            <h3 className="page-title" onClick={this.switchSelect}>
              {selected.label} <i class="material-icons">edit</i>
            </h3>
          </div> :
          <Select
            options={options}
            value={selected}
            onChange={this.handleChange}
            placeholder='Seleccione un contexto' />
        }
      </Col >
    )
  }
};

export default ContextSelector;
