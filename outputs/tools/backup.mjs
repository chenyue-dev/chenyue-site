#!/usr/bin/env node
/**
 * 帅栈数据备份工具
 *
 * 仅在本机或安全的自动化环境运行，不要把 service_role key 放进网页或仓库。
 *
 * PowerShell 示例：
 *   $env:SUPABASE_URL="https://xxxx.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY="..."
 *   node tools/backup.mjs
 */

import fs from "node:fs";
import path from "node:path";

const supabaseUrl = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 环境变量。");
  process.exit(1);
}

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};
const stamp = new Date().toISOString().replaceAll(":", "-").replace(/\.\d{3}Z$/, "Z");
const outputDirectory = path.resolve("backups", stamp);
const tables = ["posts", "projects", "resources", "comments", "page_views"];

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  }
  return response;
}

async function backupTables() {
  for (const table of tables) {
    const response = await request(
      `${supabaseUrl}/rest/v1/${table}?select=*`,
    );
    fs.writeFileSync(
      path.join(outputDirectory, `${table}.json`),
      JSON.stringify(await response.json(), null, 2),
      "utf8",
    );
  }
}

async function listObjects(prefix = "") {
  const response = await request(`${supabaseUrl}/storage/v1/object/list/${bucket}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prefix,
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    }),
  });
  const items = await response.json();
  const files = [];

  for (const item of items) {
    const objectPath = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null || item.id === undefined) {
      files.push(...(await listObjects(objectPath)));
    } else {
      files.push(objectPath);
    }
  }
  return files;
}

async function backupMedia() {
  const files = await listObjects();
  const mediaDirectory = path.join(outputDirectory, "media");
  fs.mkdirSync(mediaDirectory, { recursive: true });

  for (const objectPath of files) {
    const encodedPath = objectPath
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const response = await request(`${supabaseUrl}/storage/v1/object/${bucket}/${encodedPath}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const destination = path.join(mediaDirectory, ...objectPath.split("/"));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, buffer);
  }
  return files.length;
}

async function main() {
  fs.mkdirSync(outputDirectory, { recursive: true });
  console.log(`Backup target: ${outputDirectory}`);
  await backupTables();
  console.log("Database tables exported.");
  const mediaCount = await backupMedia();
  console.log(`Storage objects exported: ${mediaCount}`);

  fs.writeFileSync(
    path.join(outputDirectory, "manifest.json"),
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        supabaseUrl,
        tables,
        mediaCount,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log("Backup complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
