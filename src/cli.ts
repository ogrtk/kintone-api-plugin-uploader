import fs from "node:fs";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

/**
 * Get parameters
 * @returns
 */
function getParams() {
  // Extract environment values
  const envSubdomain = process.env.KINTONE_SUBDOMAIN;
  const envUsername = process.env.KINTONE_USERNAME;
  const envPassword = process.env.KINTONE_PASSWORD;
  const envProxy = process.env.KINTONE_PROXY;

  const argv = yargs(hideBin(process.argv))
    .option("file", {
      alias: "f",
      description: "The path of the plugin file.",
      type: "string",
      demandOption: true,
    })
    .option("subdomain", {
      alias: "d",
      description: "Kintone domain",
      type: "string",
      default: envSubdomain,
    })
    .option("username", {
      alias: "u",
      description: "Kintone username (must have administrative privileges)",
      type: "string",
      default: envUsername,
    })
    .option("password", {
      alias: "p",
      description: "Kintone password",
      type: "string",
      default: envPassword,
    })
    .option("idfile", {
      alias: "i",
      description: "The path of the plugin ID file.",
      type: "string",
      default: "pluginId.txt",
    })
    .option("proxy", {
      alias: "x",
      description: "proxy",
      type: "string",
      default: envProxy,
    })
    .help()
    .alias("help", "h")
    .parseSync();

  // check parameters
  if (!argv.subdomain || !argv.username || !argv.password) {
    console.error("Domain, username and password must all be specified.");
    process.exit(1);
  }

  return {
    subdomain: argv.subdomain,
    username: argv.username,
    password: argv.password,
    pluginFilePath: argv.file,
    pluginIdPath: argv.idfile,
    proxy: argv.proxy,
  };
}

/**
 * Split url string into protocol, auth(username,password), host and port
 * @param url
 * @returns
 */
function parseUrl(url: string | undefined) {
  if (!url) return undefined;
  const parsedUrl = new URL(url);

  return {
    protocol: parsedUrl.protocol.replace(":", ""),
    auth: {
      username: parsedUrl.username,
      password: parsedUrl.password,
    },
    host: parsedUrl.hostname,
    port: Number.parseInt(parsedUrl.port),
  };
}

/**
 * Load plugin id from the specified file
 * @param pluginIdPath
 * @returns
 */
function loadPluginID(pluginIdPath: string) {
  try {
    const rawData = fs.readFileSync(pluginIdPath, "utf8");
    return rawData;
  } catch (error) {
    console.error("Could not load pluginId file:", (error as Error).message);
    return "";
  }
}

/**
 * Save plugin id to the specified file
 * @param pluginIdPath
 * @param content
 * @returns
 */
function savePluginID(pluginIdPath: string, content: string) {
  try {
    fs.writeFileSync(pluginIdPath, content, "utf8");
  } catch (error) {
    console.error("Could not write pluginId file:", (error as Error).message);
    return "";
  }
}

// Get parameters
const { subdomain, username, password, pluginFilePath, proxy, pluginIdPath } =
  getParams();

const client = new KintoneRestAPIClient({
  baseUrl: subdomain,
  auth: { username, password },
  proxy: parseUrl(proxy),
});

try {
  // Upload plugin file
  console.log("Uploading file...");

  const fileKey = (
    await client.file.uploadFile({ file: { path: pluginFilePath } })
  ).fileKey;

  console.log("File uploaded successfully. fileKey:", fileKey);

  // Load plugin id
  const pluginId = loadPluginID(pluginIdPath);

  if (pluginId) {
    // Update if plugin id exists
    await client.plugin.updatePlugin({ fileKey, id: pluginId });
    console.log("Plugin updated successfully.");
  } else {
    // Install if plugin id not exists yet
    const issuedPluginId = (await client.plugin.installPlugin({ fileKey })).id;
    console.log(`Plugin added successfully. ID:${issuedPluginId}`);
    // Save issued plugin id
    savePluginID(pluginIdPath, issuedPluginId);
  }
} catch (error) {
  console.error("An error has occurred.");
  console.error(error);
  throw error;
}
