import FiniteStateMachineBot from "./FiniteStateMachineBot";

const CONVERSATION_FLOW = [
  {
    id: "greetings",
    response: {
      messages: [
        "Select category you want to search"
      ],
      buttons: [
        {
          state: "searchChannel",
          display: "youtube channel"
        },
        {
          state: "searchVideo",
          display: "youtube video"
        }
      ]
    }
  },
  {
    id: "searchChannel",
    response: {
      messages: [
        "Type channel you want to search",
      ],
      buttons: [],
      nextState: 'onSearching'
    }
  },
  {
    id: "searchVideo",
    response: {
      messages: [
        "Type video you want to search",
      ],
      buttons: [],
      nextState: 'onSearching'
    }
  },
  {
    id: 'onSearching',
    response: (text) => {
      return Promise.resolve({messages: ['async message ' + text]});
    }
  },
  {
    id: "incomprehension",
    response: {
      messages: ["Sorry didn't understand"],
      buttons: [
        {
          state: "greetings",
          display: "greetings"
        }
      ]
    }
  }
];

const createYoutubeSearchChatBot = user => {
  return new FiniteStateMachineBot(CONVERSATION_FLOW);
};

export default createYoutubeSearchChatBot;
