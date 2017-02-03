import React, { Component } from 'react';
import deviceManager from '../../comms/devices/DeviceManager';

function TagList (props) {
  const tags = props.tags;
  return (
    <div className="col m6 data">
      { tags.map((tag) => <span key={tag}>{tag}</span>) }
    </div>
  )
}

function ListItem(props) {
  console.log("about to render device", props.device);
  return (
    <div className="lst-entry row" id={props.device.id}>
      {/* <!-- text status area --> */}
      <div className="lst-line col s10">
        <div className="lst-title col s12">
          <span>{props.device.label}</span>
        </div>
        <div className="col m12 hide-on-small-only">
          <div className="col m4 data no-padding-left">{props.device.id}</div>
          <div className="col m2 data">{props.device.type}</div>
          {/* this is col m6 */}
          <TagList tags={props.device.tags}/>
        </div>
      </div>

      {/* <!-- icon status area --> */}
      <div className="lst-line col s2" >
        <div className="lst-line lst-icon pull-right">
          { props.device.status ? (
            <span className="fa fa-wifi fa-2x"></span>
          ) : (
            <span className="fa-stack">
              <i className="fa fa-wifi fa-stack-2x"></i>
              <i className="fa fa-times fa-stack-1x no-conn"></i>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ListRender(props) {
  const deviceList = props.devices;
  return (
    <div>
      { deviceList.map((device) => <ListItem device={device} key={device.id} /> ) }
    </div>
  )
}

function MapRender(props) {
  const deviceList = props.devices;
  return (
    <div>
      <p>map goes here!</p>
    </div>
  )
}

class DeviceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "list"
    };
  }

  handleViewChange(event) {
    console.log("got event", event, event.target.value);
  }

  render() {
    return (
      <div className="col m10 s12 offset-m1 " >
        {/* header */}
        <div className="row">
          <div className="col s12 m4">
            <div className="switch top-header right-align">
              <label>
                <span className="fa fa-map"></span>
                <input type="checkbox" onChange={this.handleViewChange}/>
                <span className="lever"></span>
                <span className="fa fa-list"></span>
              </label>
            </div>
          </div>
          <div className="col s12 col m8">
            <form role="form">
              {/* filter selection  */}
              <div className="input-field">
                <i className="search-icon prefix fa fa-filter"></i>
                <label htmlFor="deviceFiltering">Filter</label>
                <input id="deviceFiltering" type="text"></input>
              </div>
            </form>
          </div>
        </div>

        { this.state.display === 'map' && <MapRender devices={this.props.devices}/>  }
        { this.state.display === 'list' && <ListRender devices={this.props.devices}/> }

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>
      </div>
    )
  }
}

class NewDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newDevice: {
        id: "",
        label: "",
        type: "",
        tags: []
      },
      options: [ "MQTT", "CoAP", "Virtual" ]
    }

    this.addTag = this.addTag.bind(this);
    this.createDevice = this.createDevice.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addTag(t) {
    state = this.state.newDevice;
    state.tags.push(t);
    this.setState({newDevice: state});

    console.log("new state is: ", this.state.newDevice);
  }

  createDevice() {
    this.props.createDevice(this.state.newDevice);
  }

  handleChange(event) {
    const target = event.target;
    let state = this.state.newDevice;
    state[target.name] = target.value;
    this.setState({
      newDevice: state
    });

    console.log("new state is: ", this.state.newDevice);
  }

  render() {
    return (
      <div>
        <div id="newDeviceBtn" className="" >
          <button data-target="newDeviceForm" className="btn waves-effect waves-light btn-default" >
            <i className="fa fa-plus fa-2x"></i>
          </button>
        </div>

        <div className="modal" id="newDeviceForm">
          <div className="modal-content">
            <div className="row">
              <form role="form">
                {/* <!-- name --> */}
                <div className="row">
                  <div className="input-field col s12">
                    <label htmlFor="fld_name">Name</label>
                    <input id="fld_name" type="text"
                           name="label"
                           onChange={this.handleChange}
                           value={this.state.newDevice.label} />
                  </div>
                </div>
                {/* <!-- device type --> */}
                <div className="row">
                  <div className="col s12">
                    <label htmlFor="fld_deviceTypes" >Type</label>
                    <select id="fld_deviceTypes" className="browser-default"
                            name="type"
                            value={this.state.newDevice.type}
                            onChange={this.handleChange}>
                      <option value="" disabled>Select type</option>
                      {this.state.options.map((type) => <option value={type} key={type}>{type}</option>)}
                    </select>
                  </div>
                </div>
                {/* <!-- tags --> */}
                <div className="row">
                  <div className="col s10">
                    <div className="input-field">
                      <label htmlFor="fld_newTag" >Tag</label>
                      <input id="fld_newTag" type="text"></input>
                    </div>
                  </div>
                  <div className="col s2" >
                    <div title="Add tag" className="btn btn-item btn-floating waves-effect waves-light cyan darken-2" >
                      <i className="fa fa-plus"></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {this.state.newDevice.tags.map((tag) =>(
                    <div>
                      {tag} &nbsp;
                      <a title="Remove tag" className="btn-item">
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </a>
                    </div>
                  ))}
                </div>
              </form>
              <div className="pull-right">
                <a href="#"
                   onClick={this.createDevice}
                   className=" modal-action modal-close waves-effect waves-green btn-flat">Create</a>
                <a href="#" className=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Devices extends Component {

  constructor(props) {
    super(props);

    this.state = {
      devices: deviceManager.getDevices()
    };

    this.createDevice = this.createDevice.bind(this);
  }

  createDevice(device) {
    console.log("about to create device");
    const devList = deviceManager.addDevice(device);
    this.setState({devices: devList});
  }

  render() {
    console.log("device list on master object", this.state.devices);
    return (
      <page>
        <DeviceList devices={this.state.devices}/>
        <NewDevice createDevice={this.createDevice}/>
      </page>
    );
  }
}

export default Devices;