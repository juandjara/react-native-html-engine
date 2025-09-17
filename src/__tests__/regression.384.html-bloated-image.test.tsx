import RenderHTML from '../RenderHTML';
import { render, screen } from '@testing-library/react-native';
import IMGElement from '../elements/IMGElement';

/**
 * https://github.com/meliorence/react-native-render-html/issues/384
 **/
describe('RenderHTML component', () => {
  describe('should pass regression regarding RenderHTML props passed to image renderer', () => {
    it('translated image elements should not contain a renderers prop', () => {
      render(
        <RenderHTML
          debug={false}
          source={{ html: '<img src="https://img.com/1"/>' }}
        />
      );
      const image = screen.UNSAFE_getByType(IMGElement);
      expect(image.props.renderers).not.toBeDefined();
    });
  });
});
