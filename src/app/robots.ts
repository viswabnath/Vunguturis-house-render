import { MetadataRoute } from "next";

// Private client package: search engines and AI crawlers are kept out.
// Link-preview bots are allowed so a shared link (WhatsApp, iMessage, Slack, etc.) still shows its title and image.
// They only build the preview card; every page and file also sends X-Robots-Tag: noindex (next.config.mjs).
const PREVIEW_BOTS = ["facebookexternalhit", "WhatsApp", "Twitterbot", "Slackbot", "TelegramBot", "LinkedInBot", "Discordbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: PREVIEW_BOTS, allow: "/" },
      { userAgent: "*", disallow: "/" },
    ],
  };
}
