import FiniteStateMachineBot from "./FiniteStateMachineBot";
import { searchChannels, searchVideos } from "../services/Youtube";

const CONVERSATION_FLOW = [
  {
    id: "greetings",
    response: {
      messages: ["Select category you want to search"],
      buttons: [
        {
          state: "searchChannel",
          display: "youtube channel",
        },
        {
          state: "searchVideo",
          display: "youtube video",
        },
      ],
    },
  },
  {
    id: "searchChannel",
    response: {
      messages: ["Type channel you want to search"],
      buttons: [],
      nextState: "onSearchingChannels",
    },
  },
  {
    id: "searchVideo",
    response: {
      messages: ["Type video you want to search"],
      buttons: [],
      nextState: "onSearchingVideos",
    },
  },
  {
    id: "onSearchingChannels",
    response: (text) => {
      return searchChannels(text)
        .then((channels) => {
          return {
            messages: channels,
          };
        })
        .catch(() => {
          return {
            messages: [],
          };
        });
    },
  },
  {
    id: "onSearchingVideos",
    response: (text) => {
      return searchVideos(text)
        .then((videos) => {
          return {
            messages: videos,
          };
        })
        .catch(() => {
          return {
            messages: [],
          };
        });
    },
  },
  {
    id: "incomprehension",
    response: {
      messages: ["Sorry didn't understand"],
      buttons: [
        {
          state: "greetings",
          display: "greetings",
        },
      ],
    },
  },
];

const createYoutubeSearchChatBot = (user) => {
  return new FiniteStateMachineBot(CONVERSATION_FLOW);
};

export default createYoutubeSearchChatBot;
