# Compare Object Path

## Synopsis
This is a js library to allow easy setup for comparing 2 object by
using passed paths to compare the equality of one object to the other.

## Motivation

I built this to help with larger reactJs components that need a cleaner way of implementing 
shouldComponentUpdate. However, in building it I found it was just an object comparison util
function so made it generic to be used in more that just reactJs.

## Installation
```
npm install compare-object-path
```

## Basic Usage
```javascript
import compareObjectPath from 'compare-object-path';

export default class testComponent extends Component {

  shouldComponentUpdate(nextProps) {
    // will only update if 'test.path.i.care.about' or 
    // 'test.other.path.i.care.about' changes between current and next props 
    return compareObjectPath([
      'test.path.i.care.about',
      'test.other.path.i.care.about'
      ], this.props, nextProps);
  }

  render() {
    return (<div>test</div>);
  }
}
```

## Params
The compareObjectPath function takes 4 params with the first 3 being required

| param        | description                                                           | required  |
| ------------ |:---------------------------------------------------------------------:| ---------:|
| passedPaths  | These are the paths that you wish to check in current/next props      | true      |
| currProps    | This is usually `this.props`                                          | true      |
| nextProps    | This is the `nextProps` come from `shouldComponentUpdate` function    | true      |
| passedConfig | This is the config passed by the user to overwrite the default config | false     |

### passedPaths
These are the paths that you wish to check in current/next props. 
They must always be passed as an array of strings/strings[] or objects.

#### Examples
```javascript
// array of strings
compareObjectPath([
      'test.path.i.care.about',
      'test.other.path.i.care.about'
      ], this.props, nextProps);

// array of strings and string arrays
compareObjectPath([
      'test.path.i.care.about',
      ['test','other','path','i','care','about']
      ], this.props, nextProps);

// array of string and objects with/without omit
compareObjectPath([
      'test.path.i.care.about',
      ['test','other','path','i','care','about'],
      {
        path: 'test.my.path.i.care.about'
      },
      {
         path: 'test.my.path.i.care.about',
         omit: [
           'function1',
           ['var1', 'function2']
         ]
      },
      ], this.props, nextProps);

```

passedPaths param can take an object as a path and this object looks like:

```javascript
{
  path: string|string[] (required, this is the path you want to check),
  omit: string|string[] (optional, omit that starts at your path end)
}
```

This option is great for very complex props where you may want to check the entirety of 
one property object. However, on another prop you may want to check the whole object 
but omit a few inner properties

### passedConfig (optional)
This is the config passed by the user to overwrite the default config. This is the 
four param to compareObjectPath can be passed and it has 2 options available

```javascript
{
  defaultValue: boolean (default: true, this value is return when an error occurs),
  omitPathsOnly: boolean (default: false, this is used to assume you want to 
    check all props and used passed paths as omits)
}
```
#### Examples
##### Default Value usage:
```javascript
import compareObjectPath from 'compare-object-path';

export default class testComponent extends Component {

  shouldComponentUpdate(nextProps) {
    // no paths are passed causing an error, by default we would return true, but in this case 
    // we set a default of false so the funciton would return false
    return compareObjectPath(null, this.props, nextProps, { defaultValue: false });
  }

  render() {
    return (<div>test</div>);
  }
}
```

##### Omit Paths Only usage: 
###### I use this a lot for child components where all props passed to the child should be checked EXCEPT for things like, in my case, functions
```javascript
import compareObjectPath from 'compare-object-path'

export default class testComponent extends Component {

  shouldComponentUpdate(nextProps) {
    // we want to check all of props but remove function1 
    // and function2 from props before checking
    return compareObjectPath([
      'function1',
      'function2'
      ], this.props, nextProps, { omitPathsOnly: true });
  }

  render() {
    return (<div>test</div>);
  }
}
```

## Tests
To see tests run

```
npm run tests
```

* Requires Node Version 4+ to run tests.

## License
MIT