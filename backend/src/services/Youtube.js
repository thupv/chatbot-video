"use strict";

import { google } from "googleapis";
import { logger } from "../winston.config";
import { youtubeApiKey } from "../../config";

const YoutubeApi = google.youtube("v3");
google.options({
  auth: youtubeApiKey,
});

export async function searchChannels(text) {
  try {
    const res = await YoutubeApi.search.list({
      part: "snippet",
      type: "channel",
      q: text,
    });
    if (res.status !== 200) {
      throw new Error("Cannot search for youtube channel");
    }
    const {
      data: { items },
    } = res;
    const result = items.map((channel) => ({
      url: `https://www.youtube.com/channel/${channel.id.channelId}`,
      title: channel.snippet.channelTitle,
      thumbnailUrl: channel.snippet.thumbnails.medium.url,
    }));
    return result;
  } catch (error) {
    logger.error(error);
  }
}

export async function searchVideos(text) {
  try {
    const res = await YoutubeApi.search.list({
      part: "snippet",
      type: "video",
      q: text,
    });
    if (res.status !== 200) {
      throw new Error("Cannot search for youtube videos");
    }
    const {
      data: { items },
    } = res;
    const result = items.map((video) => ({
      url: `https://youtube.com/watch?v=${video.id.videoId}`,
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.medium.url,
    }));
    return result;
  } catch (error) {
    logger.error(error);
  }
}
