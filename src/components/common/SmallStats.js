import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Card, CardBody } from "shards-react";

class SmallStats extends React.Component {

  render() {
    const { variation, label, value, button } = this.props;

    const cardClasses = classNames(
      "stats-small",
      variation && `stats-small--${variation}`
    );

    const cardBodyClasses = classNames(
      variation === "1" ? "p-0 d-flex" : "px-0 pb-0"
    );

    const innerWrapperClasses = classNames(
      "d-flex",
      variation === "1" ? "flex-column m-auto" : "px-3"
    );

    const dataFieldClasses = classNames(
      "stats-small__data",
      variation === "1" && "text-center"
    );

    const labelClasses = classNames(
      "stats-small__label",
      "text-uppercase",
      variation !== "1" && "mb-1"
    );

    const valueClasses = classNames(
      "stats-small__value",
      "count",
      variation === "1" ? "my-3" : "m-0"
    );

    var button_render = (!button) ? '' :
      (button && button.init) ?
        <button type="button" className="btn btn-danger active-accent" onClick={button.action}>Detener</button>
        : <button type="button" className="btn btn-success active-accent" onClick={button.action}>Iniciar</button>

    return (
      <Card small className={cardClasses}>
        <CardBody className={cardBodyClasses}>
          <div className={innerWrapperClasses}>
            <div className={dataFieldClasses}>
              <span className={labelClasses}>{label}</span>
              <h6 className={valueClasses}>{value}</h6>
              {button_render}
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

SmallStats.propTypes = {
  /**
   * The label.
   */
  label: PropTypes.string,
  /**
   * The value.
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  button: PropTypes.any
};

SmallStats.defaultProps = {
  value: 0,
  label: "Label"
};

export default SmallStats;
