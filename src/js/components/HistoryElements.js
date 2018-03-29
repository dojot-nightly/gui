import React, { Component } from 'react';
import util from "../comms/util/util";
import { Line } from 'react-chartjs-2';
import { PositionRenderer } from '../views/devices/DeviceMap';
import Script from 'react-load-script';
import { Loading } from './Loading.js';
import MeasureStore from '../stores/MeasureStore';


class Graph extends Component{
  constructor(props) {
    super(props);
  }

  render() {

    let labels = [];
    let values = [];

    function getValue(tuple) {
      let val_type = typeof tuple.attrValue;
      if (val_type === "string" && tuple.attrType !== "string") {
        if (tuple.attrValue.trim().length > 0) {
          if (tuple.attrType.toLowerCase() === 'integer') {
            return parseInt(tuple.attrValue);
          } else if (tuple.attrType.toLowerCase() === 'float'){
            return parseFloat(tuple.attrValue);
          }
        }
      } else if (val_type === "number") {
        return tuple.attrValue;
      }

      return undefined;
    }

    this.props.data[this.props.device.id]['_'+this.props.attr].map((i) => {
      labels.push(util.iso_to_date_hour(i.ts));
      values.push(i.value);
    })

    if (values.length === 0) {
      return (
        <div className="valign-wrapper full-height background-info no-data-av">
          <div className="full-width center">No data available</div>
        </div>
      )
    }

    let filteredLabels = labels.map((i,k) => {
      if ((k === 0) || (k === values.length - 1)) {
        return i;
      } else {
        return "";
      }
    });

    const data = {
      labels: labels,
      xLabels: filteredLabels,
      datasets: [
        {
          label: 'Device data',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(235,87,87,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(235,87,87,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(235,87,87,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: values
        }
      ]
    };

    const options = {
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        xAxes: [{ ticks:{
          fontSize: 9,
          fontColor: '#000000',
          fontWeight: 'bold'
          }
        }],
      },
      layout: {
        padding: { left: 10}
      },
    };

    return (
      <Line data={data} options={options}/>
    )
  }
}


function HistoryList(props) {
  console.log("props: ", props);
  const empty = (
    <div className="full-height background-info valign-wrapper no-data-av">
      <div className="center full-width">No data available</div>
    </div>
  );


  // handle values
  let value = []
  for(let k in props.data[props.device.id]['_'+props.attr]){
     value[k] = props.data[props.device.id]['_'+props.attr][k];
  }

  if (value.length > 0){
    let trimmedList = value.filter((i) => {
      if (i.value.length != undefined) {
        return i.value.length > 0
      } else {
        return i.value
      }      
    })

    trimmedList.reverse();

    if (trimmedList.length > 0) {
      return (
        <div className="relative full-height" >
          <div className="full-height full-width scrollable history-list">
            {trimmedList.map((i,k) => {
              return (<div className={"row " + (k % 2 ? "alt-row" : "")} key={i.ts}>
                <div className="col s7 value">{i.value}</div>
                <div className="col s5 label">{util.iso_to_date(i.ts)}</div>
              </div>
            )})}
          </div>
        </div>
      )
    }
  } else {
    return (
      <div className="valign-wrapper full-height background-info">
        <div className="full-width center">No data <br />available</div>
      </div>
    )
  }
}

class PositionWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      hasPosition: false,
      pos: [],
      mapquest: false
    };
    this.getDevicesWithPosition = this.getDevicesWithPosition.bind(this);
    this.toogleExpand = this.toogleExpand.bind(this);
    this.mqLoaded = this.mqLoaded.bind(this);
  }

  mqLoaded(){
    this.setState({mapquest: true});
  }

  toogleExpand(state) {
    this.setState({opened: state});
  }


  getDevicesWithPosition(device){
    function parserPosition(position){
      let parsedPosition = position.split(",");
      return [parseFloat(parsedPosition[0]), parseFloat(parsedPosition[1])];
    }

    let validDevices = [];
    let length = device['_'+this.props.attr].length;
       for(let j in device.attrs){
         for(let i in device.attrs[j]){
           if(device.attrs[j][i].type == "static"){
             if(device.attrs[j][i].value_type == "geo:point"){
               device.position = parserPosition(device.attrs[j][i].static_value);
             } 
           }
         }
       }

      device.select = true;
      if(device.position !== null && device.position !== undefined){
        validDevices.push(device);
      }
    return validDevices;
  }

  render() {
    function NoData() {
        return (
          <div className="valign-wrapper full-height background-info">
            <div className="full-width center">No position <br />available</div>
          </div>
        )
    }

    if (this.props.device === undefined)
    {
      return (<NoData />);
    }

    let validDevices = this.getDevicesWithPosition(this.props.data[this.props.device.id]);
    if (validDevices.length == 0) {
      return <NoData />;
    } else {
      return(
        <div className={"PositionRendererDiv " + (this.state.opened ? "expanded" : "compressed")}>
          <div>
            <Script url="https://www.mapquestapi.com/sdk/leaflet/v2.s/mq-map.js?key=zvpeonXbjGkoRqVMtyQYCGVn4JQG8rd9"
                    onLoad={this.mqLoaded}>
            </Script>
          </div>
          {this.state.mapquest ? (
            <PositionRenderer devices={validDevices} allowContextMenu={false} center={validDevices[0].position} zoom={14}/>
          ): (
            <Loading />
          )}
        </div>
      )
    }
  }
}

function Attr(props) {
  const known = {
    'integer': Graph,
    'float': Graph,
    'string': HistoryList,
    'geo': HistoryList,
    'default': HistoryList,
    'boolean': HistoryList,
    'geo:point': PositionWrapper
  };

  const Renderer = props.type in known ? known[props.type] : known['default'];
  function NoData() {
      return (
        <div className="mt60px full-height background-info">
          <div className="full-width center">No data received</div>
        </div>
      )
  }

  function NoDataAv() {
      return (
        <div className="mt60px full-height background-info">
          <div className="full-width center">No data available</div>
        </div>
      )
  }

  if (props.data[props.device.id] === undefined) {
    return <NoData />;
  }

  let label = props.attr;
  if (props.data[props.device.id]['_'+props.attr] == undefined) {
      return <NoDataAv />;
  }


  return (
    <Renderer {...props} />
  )

}

export { Attr };
