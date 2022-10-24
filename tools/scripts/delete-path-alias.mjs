import { readFileSync, writeFileSync } from 'fs';

function deletePathAlias(alias) {
  const encoding = 'utf8';
  const tsconfigBaseJson = JSON.parse(readFileSync('tsconfig.base.json', { encoding }));

  delete tsconfigBaseJson.compilerOptions.paths[alias];

  writeFileSync('tsconfig.base.json', JSON.stringify(tsconfigBaseJson, null, 2), { encoding });
}

const [aliasArgument] = process.argv.slice(2);

deletePathAlias(aliasArgument);
