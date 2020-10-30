import * as json from 'json';

function editJsonInPlace(filePath, commands) {
  json.main(['', '', '-f', filePath, '--in-place', '-e', `${commands.join('; ')};`]);
}

function deletePathAlias(alias) {
  editJsonInPlace('tsconfig.json', [`delete this.compilerOptions.paths["${alias}"]`]);
}

const [alias] = process.argv.slice(2);

deletePathAlias(alias);
