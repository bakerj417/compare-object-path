import _ from 'lodash';

// default config
const defaultConfig = {
  defaultValue: true,
  omitPathsOnly: false
};

/**
 * building default config and overwriting with passed config
 *
 * @private
 * @param {Object} passedConfig Config options to overwrite base config
 * @returns {Object} Returns config with overwritten properties
 */
function buildConfig(passedConfig) {
  if (!passedConfig) {
    return defaultConfig;
  }

  return Object.assign({}, defaultConfig, passedConfig);
}

/**
 * returns true if any of the paths given are different between
 * first object and second object given
 *
 * @param {Object} passedPaths Array of string paths to props
 * @param {Object} firstObject
 * @param {Object} secondObject
 * @param {Object} passedConfig Object of config overwrites
 * @returns {boolean} Returns whether paths in object are different
 */
export default function arePathsDiff(passedPaths, firstObject, secondObject, passedConfig) {
  const config = buildConfig(passedConfig);

  // if nothing was given in paths, we return default and warn if debug is on
  if (typeof passedPaths !== 'object' || passedPaths === null) {
    return config.defaultValue;
  }

  // if omit paths only flag was passed then check all props except paths passed
  if (config.omitPathsOnly) {
    return !_.isEqual(
      _.omit(firstObject, passedPaths),
      _.omit(secondObject, passedPaths)
    );
  }

  return !passedPaths.every((passedPath) => {
    let path = passedPath;
    let omit = null;

    if (typeof path === 'object' && path.hasOwnProperty('path')) {
      if (path.omit) {
        omit = path.omit;
      }

      path = path.path;
    }

    let current = _.get(firstObject, path, {});
    if (omit !== null) {
      current = _.omit(current, omit);
    }

    let next = _.get(secondObject, path, {});
    if (omit !== null) {
      next = _.omit(next, omit);
    }

    return _.isEqual(current, next);
  });
}
