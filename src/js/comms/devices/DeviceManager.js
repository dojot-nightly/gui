
class DeviceManager {
  constructor() {
    this.devices = [
      { id: '8bc74868-cc15-11e6-a2be-d3f64ba4e9f4', label: 'monitor-000', type: 'MQTT', tags:['AC control'], status: 0 },
      { id: '8bc775a4-cc15-11e6-924e-3bfc19f5a11c', label: 'monitor-001', type: 'CoAP', tags:['flood'], status: 0 },
      { id: '8bc7a736-cc15-11e6-ac37-8be4a5e2628a', label: 'monitor-002', type: 'HTTP', tags:['AC control'], status: 0 },
      { id: '8bc7e7dc-cc15-11e6-b313-0bcbaa788acd', label: 'monitor-003', type: 'MQTT', tags:['freezer'], status: 1 },
      { id: '8bc827d8-cc15-11e6-84e6-b7ab355895e2', label: 'monitor-004', type: 'MQTT', tags:['flood'], status: 0 },
      { id: '8bc8691e-cc15-11e6-b7c2-e34fd524df93', label: 'monitor-005', type: 'MQTT', tags:['flow count'], status: 1 },
      { id: '8bc8a884-cc15-11e6-bdac-8794903d72ea', label: 'monitor-006', type: 'HTTP', tags:['AC control'], status: 0 },
      { id: '8bc8ea42-cc15-11e6-87af-7764fa0701a8', label: 'monitor-007', type: 'MQTT', tags:['flow count'], status: 0 },
      { id: '8bc92930-cc15-11e6-bb29-8b44be05fada', label: 'monitor-008', type: 'HTTP', tags:['AC control'], status: 1 }
    ];
  }

  getDevices() {
    // @TODO call webservice
    return this.devices;
  }

  addDevice(d) {
    // this will be generated by the backend anyway....
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    d.id = guid();

    // @TODO call webservice
    this.devices.push(d);
    return this.devices;
  }

  removeDevice(id) {
    // @TODO call webservice
    return this.devices;
  }

  setDevice(id, device) {
    // @TODO call webservice
    return this.devices;
  }
}

var deviceManager = new DeviceManager();

export default deviceManager;