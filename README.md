# react-native-html-engine

The hackable, full-featured Open Source HTML rendering solution for React Native.

This is a fork of [react-native-render-html](https://github.com/meliorence/react-native-render-html) that is maintained by [Juan D. Jara](https://github.com/juandjara). I did change a lot of things, but the main goal is to keep the same API and features as the original repository. Maintaning the documentation sites and examples is not a priority of this fork, so please refer to the original repository for the most up-to-date information.

## Installation


```sh
npm install react-native-html-engine
```


## Usage

```jsx
import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const source = {
  html: `
<p style='text-align:center;'>
  Hello World!
</p>`
};

export default function App() {
  const { width } = useWindowDimensions();
  return (
    <RenderHtml
      contentWidth={width}
      source={source}
    />
  );
}
```

## Documentation

For documentation and examples, please refer to the original repository: https://github.com/meliorence/react-native-render-html

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

BSD 2-Clause "Simplified" License.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
