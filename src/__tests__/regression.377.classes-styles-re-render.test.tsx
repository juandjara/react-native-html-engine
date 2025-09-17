import HTML from '../RenderHTML';
import { render, screen } from '@testing-library/react-native';

/**
 * https://github.com/meliorence/react-native-render-html/issues/377
 */
describe('HTML component', () => {
  const colorYellow = {
    color: 'yellow',
  };
  const colorGreen = {
    color: 'green',
  };
  const tagsStylesInstance1 = {
    highlight: colorYellow,
  };
  const tagsStylesInstance2 = {
    highlight: colorGreen,
  };
  it('should pass regression #377 regarding classesStyles prop', () => {
    const { update } = render(
      <HTML
        debug={false}
        source={{ html: '<p class="highlight">hello world</p>' }}
        classesStyles={tagsStylesInstance1}
      />
    );
    update(
      <HTML
        debug={false}
        source={{ html: '<p class="highlight">hello world</p>' }}
        classesStyles={tagsStylesInstance2}
      />
    );
    const text = screen.getByText('hello world');
    expect(text).toHaveStyle(colorGreen);
  });
});
