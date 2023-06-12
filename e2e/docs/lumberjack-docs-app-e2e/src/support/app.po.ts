const basePath = '/lumberjack/';

export const url = (path: string) =>
  path === '' ? basePath : `${basePath}${path.replace(/^\//, '')}`.replace(/\/\/$/, '/');
