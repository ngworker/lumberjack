const projectNamePattern = /^([a-z0-9]+\-?)+$/;

export function validateProjectName(projectName) {
  const isProjectName = projectNamePattern.test(projectName);

  if (!isProjectName) {
    throw new Error(`The project name "${projectName}" has an invalid format.`);
  }
}
