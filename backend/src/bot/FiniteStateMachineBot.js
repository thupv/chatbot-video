import {isFunction} from "../utils";
export const START_STATE = 'greetings';
export const END_STATE = 'incomprehension';

export default class FiniteStateMachineBot {
  constructor(convFlow) {
    this.state = START_STATE;
    this.event = "";
    this.callbacks = {};
    this.response = "";
    this.createOrchestrator(convFlow);
  }

  createOrchestrator(convFlow) {
    for (let i = 0; i < convFlow.length; i++) {
      this.addConversationStep(convFlow[i].id, convFlow[i].response);
    }
  }

  addConversationStep(name, response) {
    const self = this;
    this.add(name, function () {
      self.setResponse(response);
    });

  }

  add(_case, fn) {
    this.callbacks[_case] = this.callbacks[_case] || [];
    this.callbacks[_case].push(fn);
  }

  pseudoSwitch() {
    if (this.callbacks[this.state]) {
      this.callbacks[this.state].forEach(function (fn) {
        fn();
      });
    } else {
      this.callbacks[END_STATE].forEach(function (fn) {
        fn();
      });
    }
  }

  setResponse(response) {
    if (this.event) this.setState(response);
    if (isFunction(response)) {
      this.responseFn = (msg) => {
        return response(msg);
      }
    } else {
      this.responseFn = () => Promise.resolve(response);
    }
  }

  getResponse() {
    const msg = (' ' + this.event).slice(1);
    this.event = "";
    this.pseudoSwitch();
    return this.responseFn(msg);
  }

  talk(event = "") {
    if (event) {
      this.event = event;
      this.pseudoSwitch();
    }

    return this.getResponse();
  }

  setState(response) {
    if (response.nextState) {
      this.state = response.nextState;
    } else if (response.buttons){
      let nextStates = response.buttons.map(button => button.state);
      const nextState = nextStates.find(
        item => item.toLowerCase() === this.event.toLowerCase()
      );
      if (nextState) this.state = nextState;
      else this.state = END_STATE;
    } else {
      this.state = END_STATE;
    }
  }
}
