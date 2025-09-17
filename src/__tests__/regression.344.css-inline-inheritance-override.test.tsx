import RenderHTML from '../RenderHTML';
import { render, screen } from '@testing-library/react-native';

/**
 * https://github.com/meliorence/react-native-render-html/issues/344
 */
describe('RenderHTML component should pass regression #344', () => {
  it('when anchors nested in paragraphs have their tagStyles overridden by inline inheritance', () => {
    const tagsStyles = {
      p: {
        color: 'red',
      },
      a: {
        color: 'green',
      },
    };
    render(
      <RenderHTML
        debug={false}
        tagsStyles={tagsStyles}
        source={{ html: '<p><img src="https://img.com/1"/>foo<a>bar</a></p>' }}
      />
    );
    const text = screen.getByTestId('a');
    expect(text).toHaveStyle({
      color: 'green',
    });
  });
});
