// import type { Config } from 'jest';
// import { getJestProjectsAsync } from '@nx/jest';

// export default async (): Promise<Config> => ({
//   projects: await getJestProjectsAsync(),
// });

const { getJestProjectsAsync } = require('@nx/jest');

module.exports = async () => ({
  projects: await getJestProjectsAsync(),
});
