import RenderHTML from '../RenderHTML';
import { render, screen } from '@testing-library/react-native';

/**
 * https://github.com/meliorence/react-native-render-html/issues/343
 */
describe('RenderHTML component', () => {
  const letterSpacing2 = {
    letterSpacing: 2,
  };
  const letterSpacing3 = {
    letterSpacing: 3,
  };
  const tagsStylesInstance1 = {
    a: letterSpacing2,
  };
  const tagsStylesInstance2 = {
    a: letterSpacing3,
  };
  it('should pass regression #343 regarding tagsStyles prop', () => {
    const { update } = render(
      <RenderHTML
        debug={false}
        source={{ html: '<a>hello world</a>' }}
        tagsStyles={tagsStylesInstance1}
      />
    );
    update(
      <RenderHTML
        debug={false}
        source={{ html: '<a>hello world</a>' }}
        tagsStyles={tagsStylesInstance2}
      />
    );
    const text = screen.getByText('hello world');
    expect(text).toHaveStyle(letterSpacing3);
  });
});
