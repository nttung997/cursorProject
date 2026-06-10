import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface ProjectPaths {
  projectRoot: string;
  agentsMd: string;
  webContentDir: string;
  templatesDir: string;
}

function findProjectRoot(start: string): string | null {
  let current = resolve(start);
  const root = resolve(current, "/");

  while (current !== root) {
    if (existsSync(join(current, "AGENTS.md"))) {
      return current;
    }
    if (existsSync(join(current, "websquare-demo", "WebContent"))) {
      return current;
    }
    current = dirname(current);
  }

  return null;
}

export function resolveProjectPaths(): ProjectPaths {
  const envRoot = process.env.WEBSQUARE_PROJECT_ROOT;
  const startDir = envRoot ? resolve(envRoot) : process.cwd();
  const projectRoot = findProjectRoot(startDir) ?? startDir;

  const demoWebContent = join(projectRoot, "websquare-demo", "WebContent");
  const webContentDir = existsSync(demoWebContent)
    ? demoWebContent
    : join(projectRoot, "WebContent");

  const agentsAtRoot = join(projectRoot, "AGENTS.md");
  const agentsMd = existsSync(agentsAtRoot)
    ? agentsAtRoot
    : join(dirname(projectRoot), "AGENTS.md");

  const templatesDir = join(dirname(__dirname), "templates");

  return {
    projectRoot,
    agentsMd: existsSync(agentsMd) ? agentsMd : agentsAtRoot,
    webContentDir,
    templatesDir,
  };
}
