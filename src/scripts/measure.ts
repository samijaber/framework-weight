import { fs, chalk } from 'zx';
import { getFrameworks } from '../helpers/get-frameworks.js';
import { getJsSize } from '../helpers/get-js-size.js';
import { getLighthouseReport } from '../helpers/get-lighthouse-report.js';
import { killAll } from '../helpers/kill-process.js';
import { preview } from '../helpers/preview.js';

const frameworks = await getFrameworks();

// Kill any currently running servers
await killAll(frameworks);

const frameworkKbMap: Record<string, number> = {};
for (const framework of frameworks) {
  const { process, port } = await preview(framework);
  console.info(
    `Getting lighthouse report for ${chalk.green(
      framework
    )} on http://localhost:${port}`
  );
  const report = await getLighthouseReport(`http://localhost:${port}`);
  const jsSize = getJsSize(report);
  frameworkKbMap[framework] = jsSize;
  console.info(chalk.green(`${framework}:`, jsSize + 'kb'));

  if (global.process.env.DEBUG === 'true') {
    await fs.writeFile('debug.json', JSON.stringify(report, null, 2));
  }

  // Don't throw an error when we kill the process below
  process.catch(() => null);
  process.kill();
}

console.info(chalk.green('Done!'), frameworkKbMap);
