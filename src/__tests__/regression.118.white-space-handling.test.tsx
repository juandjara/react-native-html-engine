import RenderHTML from '../RenderHTML';
import { render } from '@testing-library/react-native';
import { extractTextFromInstance } from './utils';

beforeAll(() => {
  jest.useFakeTimers();
});

/**
 * https://github.com/meliorence/react-native-render-html/issues/118
 */
describe('RenderHTML component', () => {
  it('should pass regression #118 regarding handling of CSS white-space', () => {
    const { root } = render(
      <RenderHTML
        debug={false}
        source={{ html: '  <div>  foo\n\nbar  baz  </div>' }}
      />
    );
    const renderedText = extractTextFromInstance(root);
    expect(renderedText).toEqual('foo bar baz');
  });
});
