import glob from 'glob';

export function listFilePaths(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (error, filePaths) => {
      if (error) {
        reject(error);

        return;
      }

      resolve(filePaths);
    });
  });
}
