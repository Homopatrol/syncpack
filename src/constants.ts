import { IManifestKey } from './typings';

export const COMMAND_LIST = {
  description: 'list every dependency used in your packages',
  name: 'list'
};
export const DEFAULT_PATTERN = './packages/*/package.json';
export const DEPENDENCY_TYPES: IManifestKey[] = ['dependencies', 'devDependencies', 'peerDependencies'];
export const GREATER = 1;
export const LESSER = -1;
export const OPTION_PACKAGES = {
  description: `location of packages, defaults to "${DEFAULT_PATTERN}"`,
  spec: '-p, --packages <glob>'
};
export const SAME = 0;
export const SEMVER_ORDER = ['<', '<=', '', '~', '^', '>=', '>', '*'];
