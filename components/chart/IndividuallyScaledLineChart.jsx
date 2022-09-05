import React, { PureComponent } from "react";
import * as shape from "d3-shape";
import * as array from "d3-array";
import PropTypes from "prop-types";
import { View } from "react-native";
import Svg from "react-native-svg";
import Path from "react-native-svg-charts/lib/module/animated-path";
import Chart from "react-native-svg-charts/lib/module/chart/chart";

class ChartGrouped extends PureComponent {
  state = {
    width: 0,
    height: 0,
  };

  _onLayout(event) {
    const {
      nativeEvent: {
        layout: { height, width },
      },
    } = event;
    this.setState({ height, width });
  }

  createPaths() {
    throw 'Extending "ChartGrouped" requires you to override "createPaths';
  }

  render() {
    const {
      data,
      xAccessor,
      yAccessor,
      yScale,
      xScale,
      style,
      animate,
      animationDuration,
      numberOfTicks,
      contentInset: { top = 0, bottom = 0, left = 0, right = 0 },
      gridMax,
      gridMin,
      clampX,
      clampY,
      svg,
      children,
    } = this.props;

    const { width, height } = this.state;

    if (data.length === 0) {
      return <View style={style} />;
    }

    const mappedData = data.map((dataArray) =>
      dataArray.data.map((item, index) => ({
        y: yAccessor({ item, index }),
        x: xAccessor({ item, index }),
      }))
    );

    const yValues = array.merge(mappedData).map((item) => item.y);
    const xValues = array.merge(mappedData).map((item) => item.x);

    const yExtent = array.extent([...yValues, gridMin, gridMax]);
    const xExtent = array.extent([...xValues]);

    const {
      yMin = yExtent[0],
      yMax = yExtent[1],
      xMin = xExtent[0],
      xMax = xExtent[1],
    } = this.props;

    //invert range to support svg coordinate system
    const y = yScale()
      .domain([yMin, yMax])
      .range([height - bottom, top])
      .clamp(clampY);

    const x = xScale()
      .domain([xMin, xMax])
      .range([left, width - right])
      .clamp(clampX);

    const { lines, areas } = this.createPaths({
      data: mappedData,
      x,
      y,
      height,
    });

    const ticks = y.ticks(numberOfTicks);

    const extraProps = {
      x,
      y,
      data,
      ticks,
      width,
      height,
      ...lines,
      ...areas,
    };

    return (
      <View style={style}>
        <View style={{ flex: 1 }} onLayout={(event) => this._onLayout(event)}>
          {height > 0 && width > 0 && (
            <Svg style={{ height, width }}>
              {React.Children.map(children, (child) => {
                if (child && child.props.belowChart) {
                  return React.cloneElement(child, extraProps);
                }
                return null;
              })}
              {areas.map((path, index) => {
                const { areaSvg } = data[index];
                const key = path + "-" + index;
                return (
                  <Path
                    key={key}
                    fill={"none"}
                    {...svg}
                    {...areaSvg}
                    d={path}
                    animate={animate}
                    animationDuration={animationDuration}
                  />
                );
              })}
              {lines.map((path, index) => {
                const { svg: pathSvg } = data[index];
                const key = path + "-" + index;
                return (
                  <Path
                    key={key}
                    fill={"none"}
                    {...svg}
                    {...pathSvg}
                    d={path}
                    animate={animate}
                    animationDuration={animationDuration}
                  />
                );
              })}
              {React.Children.map(children, (child) => {
                if (child && !child.props.belowChart) {
                  return React.cloneElement(child, extraProps);
                }
                return null;
              })}
            </Svg>
          )}
        </View>
      </View>
    );
  }
}

ChartGrouped.propTypes = {
  ...Chart.propTypes,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.arrayOf(PropTypes.array),
      ]),
      svg: PropTypes.object,
    })
  ).isRequired,
};

ChartGrouped.defaultProps = {
  ...Chart.defaultProps,
};

class IndividuallyScaledLineChart extends ChartGrouped {
  createPaths({ data, x, y, height }) {
    const { curve } = this.props;

    const lines = data.map((line, index) => {
      let yMin = Math.min(...line.map((d) => d.y));
      let yMax = Math.max(...line.map((d) => d.y));

      return {
        line: shape
          .line()
          .x((d) => x(d.x))
          .y((d) =>
            y
              .domain([yMin, yMax])
              .range([
                (height / data.length) * (index + 1) - 5,
                (height / data.length) * index + 5,
              ])(d.y)
          )
          .defined((item) => typeof item.y === "number")
          .curve(curve)(line),
        area: shape
          .area()
          .x((d) => x(d.x))
          .y0((d) => (height / data.length) * (index + 1) - 5)
          .y1((d) =>
            y
              .domain([yMin, yMax])
              .range([
                (height / data.length) * (index + 1) - 5,
                (height / data.length) * index + 5,
              ])(d.y)
          )
          .defined((item) => typeof item.y === "number")
          .curve(curve)(line),
      };
    });

    return {
      lines: lines.map((line) => line.line),
      areas: lines.map((line) => line.area),
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
