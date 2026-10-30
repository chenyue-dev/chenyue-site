#!/usr/bin/env node
/**
 * 检查 resources-data.js 中的官方链接。
 * 部分网站会拦截自动请求，报告中标记为“需人工确认”不代表链接一定失效。
 */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(currentDirectory, "..");
const dataFile = path.join(root, "resources-data.js");
const reportDirectory = path.join(root, "reports");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(dataFile, "utf8"), context);
const resources = context.window.SITE_RESOURCES || [];

async function check(resource) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    let response = await fetch(resource.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 shuaistack-link-check" },
    });
    if ([403, 405].includes(response.status)) {
      response = await fetch(resource.url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "Mozilla/5.0 shuaistack-link-check" },
      });
    }
    return {
      name: resource.name,
      url: resource.url,
      status: response.status,
      finalUrl: response.url,
      ok: response.status >= 200 && response.status < 400,
    };
  } catch (error) {
    return {
      name: resource.name,
      url: resource.url,
      status: 0,
      error: error.name,
      ok: false,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const results = [];
  for (let index = 0; index < resources.length; index += 6) {
    results.push(...(await Promise.all(resources.slice(index, index + 6).map(check))));
  }
  const report = {
    checkedAt: new Date().toISOString(),
    total: results.length,
    accessible: results.filter((item) => item.ok).length,
    review: results.filter((item) => !item.ok),
    results,
  };
  fs.mkdirSync(reportDirectory, { recursive: true });
  const reportFile = path.join(reportDirectory, "resource-links.json");
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), "utf8");
  console.log(
    `Checked ${report.total} links. Accessible: ${report.accessible}. Needs review: ${report.review.length}.`,
  );
  console.log(`Report: ${reportFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
