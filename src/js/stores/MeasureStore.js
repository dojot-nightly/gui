var alt = require('../alt');
var MeasureActions = require('../actions/MeasureActions');

import util from '../comms/util';


var socket = io.connect('http://localhost:1028');
socket.on('temp', function(data) {
  MeasureActions.addMeasure(data);
});

class MeasureStore {
  constructor() {
    this.measures = [];
    this.error = null;

    this.bindListeners({
      handleUpdateMeasures: MeasureActions.UPDATE_MEASURES,
      handleFetchMeasures: MeasureActions.FETCH_MEASURES,
      handleFailure: MeasureActions.MEASURES_FAILED,
      handleAdd: MeasureActions.ADD_MEASURE
    });
  }

  handleUpdateMeasures(measures) {
    this.measures = measures;
    this.error = null;
  }

  handleAdd(measure) {
    console.log("about to push", measure);
    this.measures.push(measure);
    this.measures.splice(0, 1);
  }

  handleFetchMeasures(id) {
    this.measures = [
      { timestamp: "2017-03-01T22:57:37.332373", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:38.340817", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:39.352631", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:40.364689", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:41.376666", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:42.388626", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:43.400626", value: 23.625000 },
      { timestamp: "2017-03-01T22:57:44.412569", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:45.424596", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:46.436593", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:47.448643", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:48.460620", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:49.472744", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:50.484755", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:51.496654", value: 23.625000 },
      { timestamp: "2017-03-01T22:57:52.508624", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:53.520626", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:54.532521", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:55.543878", value: 23.687500 },
      { timestamp: "2017-03-01T22:57:56.567099", value: 23.687500 }
    ];
    this.error = null;
  }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(MeasureStore, 'MeasureStore');
export default _store;
