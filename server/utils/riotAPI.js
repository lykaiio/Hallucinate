// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// IMPORTS - External libraries and environment configuration
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import dotenv from "dotenv";
import axios from "axios";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API CONFIGURATION - Riot Games API setup and authentication
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Load environment variables from .env file
dotenv.config();

// Riot API key loaded from environment variables for secure authentication
const RIOT_API_KEY = process.env.RIOT_API_KEY;

// HTTP headers required for all Riot API requests
const headers = {
  "X-Riot-Token": RIOT_API_KEY,
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// REGION MAPPING - Convert user-friendly regions to Riot API platform codes
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Maps user-selected regions to Riot's internal platform identifiers
// Used to construct proper API endpoint URLs for different servers
const regionToPlatform = {
  NA: "na1", // North America
  EUW: "euw1", // Europe West
  EUNE: "eun1", // Europe Nordic & East
  KR: "kr", // Korea
  OCE: "oc1", // Oceania
  LAN: "la1", // Latin America North
  LAS: "la2", // Latin America South
  BR: "br1", // Brazil
  TR: "tr1", // Turkey
  RU: "ru", // Russia
  JP: "jp1", // Japan
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// RIOT API FUNCTIONS - Interface with Riot Games API endpoints
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Get summoner information by Riot ID and region
 * First fetches account data from Americas API, then gets summoner details from regional API
 *
 * @param {string} gameName - Riot ID game name (part before #)
 * @param {string} tagLine - Riot ID tag line (part after #)
 * @param {string} region - Game region (NA, EUW, etc.)
 * @returns {Promise<Object>} Summoner data including ID, level, and profile info
 * @throws {Error} If region is unknown or API request fails
 */
export async function getSummonerByRiotId(gameName, tagLine, region) {
  try {
    // Step 1: Get account PUUID from Americas routing value
    const accountRes = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      { headers }
    );

    const { puuid } = accountRes.data;

    // Step 2: Convert region to platform code for regional API
    const platform = regionToPlatform[region.toUpperCase()];
    if (!platform) throw new Error(`Unknown region: ${region}`);

    // Step 3: Get summoner data from regional platform API
    const summonerRes = await axios.get(
      `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      { headers }
    );

    return summonerRes.data;
  } catch (err) {
    console.error(
      "Failed to get valid summoner data:",
      err.response?.data || err.message
    );
    throw new Error("Failed to get summoner data");
  }
}

/**
 * Get ranked statistics for a summoner by their ID and region
 * Fetches League of Legends ranked queue information including rank, LP, and win/loss data
 *
 * @param {string} summonerId - Summoner's unique ID from getSummonerByRiotId
 * @param {string} region - Game region (NA, EUW, etc.)
 * @returns {Promise<Array>} Array of ranked queue entries (Solo/Duo, Flex, etc.)
 * @throws {Error} If region is unknown or API request fails
 */
export async function getRankedStats(summonerId, region) {
  const platform = regionToPlatform[region.toUpperCase()];
  if (!platform) throw new Error(`Unknown region: ${region}`);

  const response = await axios.get(
    `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
    { headers }
  );

  return response.data;
}
