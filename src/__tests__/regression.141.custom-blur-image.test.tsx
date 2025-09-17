import { render, screen, waitFor } from '@testing-library/react-native';
import IMGElement from '../elements/IMGElement';

/**
 * https://github.com/meliorence/react-native-render-html/issues/141
 */
describe('HTMLImageElement component should pass regression test #141', () => {
  it("doesn't display the image prior to receiving original dimensions", async () => {
    const source = { uri: 'https://placehold.co/600x400' };
    const style = {};
    render(<IMGElement key="1" style={style} source={source} />);
    const placeholder = screen.getByTestId('image-loading');
    expect(placeholder).toBeTruthy();
    const imageLayout = screen.queryByTestId('image-success');
    expect(imageLayout).toBeFalsy();
    await waitFor(() => {
      expect(screen.getByTestId('image-success')).toBeTruthy();
    });
  });
});
