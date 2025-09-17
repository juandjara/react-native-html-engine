import RenderHTML from '../RenderHTML';
import { render, screen } from '@testing-library/react-native';

/**
 * https://github.com/meliorence/react-native-render-html/issues/383
 **/
describe('RenderHTML component', () => {
  describe('should pass regression regarding RenderHTML props passed to anchor renderer', () => {
    it('translated anchor elements should not contain a renderers prop', () => {
      render(<RenderHTML debug={false} source={{ html: '<a>bar</a>' }} />);
      const anchor = screen.getByText('bar');
      expect(anchor).not.toHaveProp('renderers');
    });
  });
});
