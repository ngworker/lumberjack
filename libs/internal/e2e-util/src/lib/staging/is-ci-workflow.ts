export function isCiWorkflow(): boolean {
  return process.env.CI === 'TRUE';
}
