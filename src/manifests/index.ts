import { DEFAULT_PATTERN } from '../constants';
import { writeJson } from '../lib/write-json';
import { IDictionary, IManifest, IManifestDescriptor } from '../typings';
import { getManifests } from './get-manifests';
import { manifestData } from './manifest-data';

export type GetMismatchedVersions = (pattern: string) => Promise<IDictionary<string[]>>;
export type GetVersions = (pattern: string) => Promise<IDictionary<string[]>>;
export type SetVersion = (name: string, version: string, pattern: string) => Promise<IManifestDescriptor[]>;
export type SetVersionRange = (range: string, pattern: string) => Promise<IManifestDescriptor[]>;
export type SetVersionsToNewestMismatch = (pattern: string) => Promise<IManifestDescriptor[]>;

const unwrap = (descriptors: IManifestDescriptor[]) => descriptors.map((descriptor) => descriptor.data);

export const getMismatchedVersions: GetMismatchedVersions = (pattern = DEFAULT_PATTERN) =>
  getManifests(pattern)
    .then(unwrap)
    .then(manifestData.getMismatchedVersions);

export const getVersions: GetVersions = (pattern = DEFAULT_PATTERN) =>
  getManifests(pattern)
    .then(unwrap)
    .then(manifestData.getVersions);

export const setVersion: SetVersion = (name, version, pattern = DEFAULT_PATTERN) =>
  getManifests(pattern).then((descriptors) => {
    manifestData.setVersion(name, version, unwrap(descriptors));
    return descriptors;
  });

export const setVersionRange: SetVersionRange = (range, pattern = DEFAULT_PATTERN) =>
  getManifests(pattern).then((descriptors) => {
    manifestData.setVersionRange(range, unwrap(descriptors));
    return descriptors;
  });

export const setVersionsToNewestMismatch: SetVersionsToNewestMismatch = (pattern = DEFAULT_PATTERN) =>
  getManifests(pattern)
    .then((descriptors) => {
      const data = unwrap(descriptors);
      const nextData = manifestData.setVersionsToNewestMismatch(data);
      return descriptors.map((descriptor, i) => ({
        data: nextData[i],
        path: descriptor.path
      }));
    })
    .then((descriptors) =>
      Promise.all(descriptors.map((descriptor) => writeJson(descriptor.path, descriptor.data))).then(() => descriptors)
    );
