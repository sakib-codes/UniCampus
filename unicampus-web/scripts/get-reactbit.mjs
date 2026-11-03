import { ReactBitsService } from 'file:///C:/Users/Sakib685/AppData/Roaming/npm/node_modules/reactbits-dev-mcp-server/dist/services/ReactBitsService.js';
import fs from 'fs';
import path from 'path';

const [,, command, arg1, arg2] = process.argv;

const service = new ReactBitsService();

async function main() {
  if (command === 'list') {
    const category = arg1;
    const comps = await service.listComponents(category ? { category } : { limit: 150 });
    console.log(JSON.stringify(comps, null, 2));
  } else if (command === 'search') {
    const results = await service.searchComponents({ query: arg1 });
    console.log(JSON.stringify(results, null, 2));
  } else if (command === 'get') {
    const slug = arg1;
    const style = arg2 || 'tailwind';
    console.log(`Fetching component "${slug}" with style "${style}"...`);
    const code = await service.getComponent(slug, style);
    console.log(code);
  } else if (command === 'save') {
    const slug = arg1;
    const targetPath = arg2;
    if (!slug || !targetPath) {
      console.error('Usage: node get-reactbit.mjs save <slug> <targetPath>');
      process.exit(1);
    }
    console.log(`Fetching and saving "${slug}" to ${targetPath}...`);
    const code = await service.getComponent(slug, 'tailwind');
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, code, 'utf-8');
    console.log(`Successfully saved ${slug} to ${targetPath}!`);
  } else {
    console.log('Usage:');
    console.log('  node get-reactbit.mjs list [category]');
    console.log('  node get-reactbit.mjs search <query>');
    console.log('  node get-reactbit.mjs get <slug> [style]');
    console.log('  node get-reactbit.mjs save <slug> <targetPath>');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

