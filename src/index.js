import _ from 'lodash';

/**
 * building default config and overwriting with passed config
 *
 * @private
 * @param {Object} passedConfig Config options to overwrite base config
 * @returns {Object} Returns config with overwritten properties
 */
function buildConfig(passedConfig) {
  const defaultConfig = {
    defaultValue: true,
    omitPathsOnly: false
  };

  if (!passedConfig) {
    return defaultConfig;
  }

  return Object.assign({}, defaultConfig, passedConfig);
}

/**
 * Determines if component should update based on paths passed
 *
 * @param {Object} propPaths Array of string paths to props
 * @param {Object} currProps Object of current props
 * @param {Object} nextProps Object of next props
 * @param {Object} passedConfig Object of config overwrites
 * @returns {boolean} Returns whether component should be updated
 */
export default function shouldUpdate(propPaths, currProps, nextProps, passedConfig) {
  const config = buildConfig(passedConfig);

  // if nothing was given in paths, we return default and warn if debug is on
  if (typeof propPaths !== 'object' || propPaths === null) {
    return config.defaultValue;
  }

  // if omit paths only flag was passed then check all props except paths passed
  if (config.omitPathsOnly) {
    return !_.isEqual(
      _.omit(currProps, propPaths),
      _.omit(nextProps, propPaths)
    );
  }

  return !propPaths.every((propPath) => {
    let path = propPath;
    let omit = null;

    if (typeof path === 'object' && path.hasOwnProperty('path')) {
      if (path.omit) {
        omit = path.omit;
      }

      path = path.path;
    }

    let current = _.get(currProps, path, {});
    if (omit !== null) {
      current = _.omit(current, omit);
    }

    let next = _.get(nextProps, path, {});
    if (omit !== null) {
      next = _.omit(next, omit);
    }

    return _.isEqual(current, next);
  });
}
