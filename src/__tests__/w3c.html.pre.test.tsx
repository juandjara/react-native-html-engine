import RenderHTML from '../RenderHTML';
import { render } from '@testing-library/react-native';
import { extractTextFromInstance } from './utils';

describe('RenderHTML component regarding <pre> tags behaviors', () => {
  it('preserves tabs and line breaks', () => {
    const { root } = render(
      <RenderHTML debug={false} source={{ html: '<pre>\t\n  a</pre>' }} />
    );
    const renderedText = extractTextFromInstance(root);
    expect(renderedText).toEqual('\t\n  a');
  });
  it('preserves indentation and line breaks', () => {
    const preContent = `
    function myJSFunction() {
      console.log("let's go");
      console.log("let's go");
      console.log("let's go");
    }
    `;
    const { root } = render(
      <RenderHTML debug={false} source={{ html: `<pre>${preContent}</pre>` }} />
    );
    const renderedText = extractTextFromInstance(root);
    expect(renderedText).toEqual(preContent);
  });
});
