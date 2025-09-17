import RenderHTML from '../RenderHTML';
import { render, screen } from '@testing-library/react-native';

/**
 * https://github.com/meliorence/react-native-render-html/issues/408
 */
describe('RenderHTML component', () => {
  describe('should pass regression #408 regarding two forward slashes in src', () => {
    it("should prepend 'https:' to an image src attribute with two forward slashes", async () => {
      render(
        <RenderHTML
          debug={false}
          source={{
            html: '<img src="//domain.com/" />',
            baseUrl: 'https://test.com',
          }}
        />
      );
      const image = await screen.findByTestId('image-success');
      expect(image).toHaveProp('source', { uri: 'https://domain.com/' });
    });
  });
});
