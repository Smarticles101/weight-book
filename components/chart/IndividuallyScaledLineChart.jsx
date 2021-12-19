import * as React from "react";
import * as shape from "d3-shape";
import ChartGrouped from "react-native-svg-charts/lib/module/chart/chart-grouped";

class IndividuallyScaledLineChart extends ChartGrouped {
  createPaths({ data, x, y }) {
    const { curve } = this.props;

    const lines = data.map((line) => {
      let yMin = Math.min(...line.map((d) => d.y));
      let yMax = Math.max(...line.map((d) => d.y));

      return shape
        .line()
        .x((d) => x(d.x))
        .y((d) => y.domain([yMin, yMax])(d.y))
        .defined((item) => typeof item.y === "number")
        .curve(curve)(line);
    });

    return {
      path: lines,
      lines,
    };
  }
}

IndividuallyScaledLineChart.propTypes = {
  ...ChartGrouped.propTypes,
};

IndividuallyScaledLineChart.defaultProps = {
  ...ChartGrouped.defaultProps,
};

export default (props) => <IndividuallyScaledLineChart {...props} />;
