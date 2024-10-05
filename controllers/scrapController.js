import axios from "axios";
import finnhub from "finnhub";
import * as cheerio from "cheerio";

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "cs0b6mpr01qrbtrlao30cs0b6mpr01qrbtrlao3g";
const finnhubClient = new finnhub.DefaultApi();

export const ipo = (req, res) => {
  const startDate = req.query.startDate || "2024-01-01";
  const endDate = req.query.endDate || "2024-06-15";

  finnhubClient.ipoCalendar(startDate, endDate, (error, data, response) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Error fetching IPO calendar data" });
    }
    res.json(data);
  });
};

const newspapers = [
  {
    name: "economictimes",
    address: "https://economictimes.indiatimes.com/markets/stocks/news",
    base: "https://economictimes.indiatimes.com/markets/stocks/news",
  },
];

// Function to fetch news articles
export const fetchTrends = async () => {
  const articles = [];
  for (const newspaper of newspapers) {
    try {
      const response = await axios.get(newspaper.address);
      const html = response.data;
      const $ = cheerio.load(html);

      $(".eachStory", html).each(function () {
        const anchorTag = $(this).find("a");
        const title = anchorTag.text();
        const url = anchorTag.attr("href");
        const time = $(this).find(".date-format").text();
        const newsout = $(this).find("time.date-format").text();
        const description = $(this).find("p").text();

        articles.push({
          title,
          url: newspaper.base + url,
          time,
          newsout,
          description,
          source: newspaper.name,
        });
      });
    } catch (error) {
      console.error(`Error fetching news from ${newspaper.name}:`, error);
    }
  }
  return articles;
};

// Controller function to handle the news route
export const getTrendingNews = async (req, res) => {
  try {
    const articles = await fetchTrends();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
};

// const api_key = finnhub.ApiClient.instance.authentications["api_key"];
// api_key.apiKey = "cs0b6mpr01qrbtrlao30cs0b6mpr01qrbtrlao3g";
// const finnhubClient = new finnhub.DefaultApi();

// Controller function to get recommendation trends
export const getRecommendationTrends = (req, res) => {
  const { symbol } = req.params; // Assume symbol (e.g., "ADBE") is provided in the route

  // Fetch recommendation trends
  finnhubClient.recommendationTrends(symbol, (error, data) => {
    if (error) {
      res.status(500).json({ error: "Failed to fetch recommendation trends" });
    } else {
      res.json(data);
    }
  });
};
