import React, { Component } from 'react';

class Canvas extends Component {

  componentDidMount() {
    // https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
    // and
    // https://stackoverflow.com/questions/36236814/wind-direction-on-a-compass-wunderground/36242222#36242222
    //
    // adapted from the code snippet of Roberto's answer (Mar 26 2016, 23:49) and the canvas blog

    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    let x, y, r, radians;

    x = ctx.canvas.width / 2;
    y = ctx.canvas.height / 2;
    // coords 0, 0 of canvas and coords 0, 0 of wind direction are different
    // thus r and radians are needed to align them
    r = x * 0.8;
    radians = 0.0174533 * (this.props.degrees - 90);
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height );
    
    ctx.strokeStyle = "orange";

    ctx.beginPath();

    // text, x coord, y coord, max text size in pixels
    // cardinal wind directions
    ctx.fillText("N", x, 10, 10);
    ctx.fillText("S", x, ctx.canvas.height, 10);
    ctx.fillText("W", 0, y, 10);
    ctx.fillText("E", ctx.canvas.width - 10, y, 10);

    // draw a circle in order to better visualize wind direction
    ctx.arc(x, y, x * 0.75, 0, 2 * Math.PI);

    ctx.lineWidth = 1;

    // actual wind direction in degrees in a canvas element
    ctx.moveTo(x, y);
    ctx.lineTo(x + r * Math.cos(radians), y + r * Math.sin(radians));

    ctx.stroke();
  }
  
  render() {
    return (
      <span>
        <canvas ref="canvas" width={this.props.width} height={this.props.height} title={this.props.title} />
      </span>
    )
  }
}

export default Canvas;