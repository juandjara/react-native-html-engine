import { WebBlockStyles } from '@native-html/transient-render-engine';
import { ImageErrorEvent, ImageProps, ImageStyle } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';
import IMGElement from '../IMGElement';
import HTMLImgElement from '../IMGElement';

describe('IMGElement', () => {
  it('should render an error fallback component on error', async () => {
    const source = { uri: 'error' };
    render(<HTMLImgElement source={source} />);
    await screen.findByTestId('image-error');
  });
  it('should render a GenericPressable when provided with onPress prop', async () => {
    const onPress = jest.fn();
    const source = { uri: 'https://placehold.co/600x400' };
    render(<HTMLImgElement onPress={onPress} source={source} />);
    await screen.findByTestId('generic-pressable');
  });
  it('should call onError when encountering an error after success', async () => {
    const source = { uri: 'https://placehold.co/600x400' };
    render(<IMGElement source={source} />);
    const imageSuccess = await screen.findByTestId('image-success');
    act(() =>
      (imageSuccess.props.onError as Required<ImageProps>['onError']).call(
        null,
        {
          nativeEvent: { error: '' },
        } as ImageErrorEvent
      )
    );
    await screen.findByTestId('image-error', { timeout: 50 });
  });
  describe('object-fit support', () => {
    const defaultRM = 'cover' as const;
    const specs: Record<
      Required<WebBlockStyles>['objectFit'],
      ImageStyle['resizeMode']
    > = {
      'contain': 'contain',
      'cover': 'cover',
      'unset': defaultRM,
      'fill': 'stretch',
      'scale-down': 'contain',
      '-moz-initial': defaultRM,
      'inherit': defaultRM,
      'initial': defaultRM,
      'none': defaultRM,
      'revert': defaultRM,
      'revert-layer': defaultRM,
    };
    for (const [objectFit, resizeMode] of Object.entries(specs)) {
      it(`should map object-fit "${objectFit}" to resizeMode "${resizeMode}"`, async () => {
        const source = { uri: 'https://placehold.co/600x400' };
        const style = {
          width: 320,
          height: 180,
        };
        render(
          <HTMLImgElement
            objectFit={objectFit as any}
            style={style}
            source={source}
          />
        );
        const image = await screen.findByTestId('image-success');
        expect(image).toHaveStyle({
          resizeMode,
        });
      });
    }
  });
  describe('scaling logic', () => {
    it('should use width and height from styles', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: 320,
        height: 180,
      };
      render(<HTMLImgElement style={style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle(style);
    });
    it('should use width and height from props', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: 320,
        height: 180,
      };
      render(<HTMLImgElement {...style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle(style);
    });
    it('should combine width with aspectRatio', async () => {
      const source = { uri: 'http://via.placeholder.com/640' };
      const dimensions = {
        width: 320,
      };
      render(
        <HTMLImgElement
          {...dimensions}
          style={{ aspectRatio: 2 }}
          source={source}
        />
      );
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 320,
        height: 160,
      });
    });
    it('should combine height with aspectRatio', async () => {
      const source = { uri: 'http://via.placeholder.com/640' };
      const dimensions = {
        height: 160,
      };
      render(
        <HTMLImgElement
          {...dimensions}
          style={{ aspectRatio: 2 }}
          source={source}
        />
      );
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 320,
        height: 160,
      });
    });
    it('should scale down required dimensions to contentWidth prop when appropriate', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: 320,
        height: 180,
      };
      const contentWidth = 160;
      render(
        <HTMLImgElement
          contentWidth={contentWidth}
          {...style}
          source={source}
        />
      );
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: contentWidth,
        height: contentWidth / (style.width / style.height),
      });
    });
    it('should scale the image to contentWidth prop when appropriate when only width or height is required', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: 320,
      };
      const contentWidth = 160;
      render(
        <HTMLImgElement
          contentWidth={contentWidth}
          {...style}
          source={source}
        />
      );
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: contentWidth,
        height: contentWidth / (600 / 400),
      });
    });
    it('should scale the image down when only width or height is required', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: 300,
      };
      render(<HTMLImgElement {...style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 300,
        height: 200,
      });
    });
    it('should use physical dimensions when no width or height requirements are provided', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      render(<HTMLImgElement contentWidth={800} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 600,
        height: 400,
      });
    });
    it('should handle 0-width and height requirements', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: 0,
        height: 0,
      };
      render(<HTMLImgElement {...style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 0,
        height: 0,
      });
    });
    it('should handle 0-width or height requirements', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: 0,
      };
      render(<HTMLImgElement {...style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 0,
        height: 0,
      });
    });
    it('should handle maxWidth requirements', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        maxWidth: 300,
      };
      render(<HTMLImgElement style={style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 300,
        height: 200,
      });
    });
    it('should handle maxHeight requirements', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        maxHeight: 200,
      };
      render(<HTMLImgElement style={style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 300,
        height: 200,
      });
    });
    it('should handle minWidth requirements', async () => {
      const source = { uri: 'http://via.placeholder.com/10x12' };
      const style = {
        minWidth: 30,
      };
      render(<HTMLImgElement style={style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 30,
        height: 36,
      });
    });
    it('should handle minHeight requirements', async () => {
      const source = { uri: 'http://via.placeholder.com/10x12' };
      const style = {
        minHeight: 36,
      };
      render(<HTMLImgElement style={style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 30,
        height: 36,
      });
    });
  });
  describe('special units', () => {
    it('should ignore requirements in percentage when enableExperimentalPercentWidth or contentWidth props are not set', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: '50%',
      };
      render(<HTMLImgElement {...style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 600,
        height: 400,
      });
    });
    it('should support strings for width and height which can be parsed to numbers', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        width: '50',
      };
      render(<HTMLImgElement {...style} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 50,
      });
    });
    describe('when given enableExperimentalPercentWidth + contentWidth props', () => {
      it('should support requirements in percentage', async () => {
        const source = { uri: 'https://placehold.co/600x400' };
        const contentWidth = 250;
        const style = {
          width: '50%',
        };
        render(
          <HTMLImgElement
            enableExperimentalPercentWidth
            contentWidth={contentWidth}
            {...style}
            source={source}
          />
        );
        const image = await screen.findByTestId('image-success');
        expect(image).toBeTruthy();
        expect(image).toHaveStyle({
          width: contentWidth * 0.5,
        });
      });
      it('should constrain a percentage width with the value returned by computeMaxWidth', async () => {
        const source = { uri: 'https://placehold.co/600x400' };
        const contentWidth = 250;
        const style = {
          width: '80%',
        };
        render(
          <HTMLImgElement
            enableExperimentalPercentWidth
            computeMaxWidth={(c) => c * 0.7}
            contentWidth={250}
            {...style}
            source={source}
          />
        );
        const image = await screen.findByTestId('image-success');
        expect(image).toBeTruthy();
        expect(image).toHaveStyle({
          width: contentWidth * 0.7,
        });
      });
      it('should ignore percentage heights', async () => {
        const source = { uri: 'https://placehold.co/600x400' };
        const contentWidth = 250;
        const style = {
          height: '10%',
        };
        render(
          <HTMLImgElement
            enableExperimentalPercentWidth
            contentWidth={250}
            {...style}
            source={source}
          />
        );
        const image = await screen.findByTestId('image-success');
        expect(image).toBeTruthy();
        expect(image).toHaveStyle({
          width: contentWidth,
          height: (400 / 600) * contentWidth,
        });
      });
    });
  });
  describe('capabilities regarding spacing', () => {
    it('should take into account horizontal margins when scaling down', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        margin: 25,
        marginHorizontal: 30,
      };
      render(
        <HTMLImgElement contentWidth={200} style={style} source={source} />
      );
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        width: 200 - 30 * 2,
      });
    });
  });
  describe('when changing props', () => {
    it('should update box width and height when requirements change', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const initialStyle = {
        width: 600,
        height: 400,
      };
      const nextStyle = {
        width: 320,
        height: 180,
      };
      const { update } = render(
        <HTMLImgElement {...initialStyle} source={source} />
      );
      update(<HTMLImgElement {...nextStyle} source={source} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle(nextStyle);
    });
    it('should update uri and fetch new dimensions when source changes', async () => {
      const initialSource = { uri: 'https://placehold.co/600x400' };
      const nextSource = { uri: 'http://via.placeholder.com/1920x1080' };
      const { update } = render(<HTMLImgElement source={initialSource} />);
      const image1 = await screen.findByTestId('image-success');
      expect(image1).toBeTruthy();
      expect(image1).toHaveStyle({
        width: 600,
        height: 400,
      });
      update(<HTMLImgElement source={nextSource} />);
      await screen.findByTestId('image-loading');
      const image2 = await screen.findByTestId('image-success');
      expect(image2).toBeTruthy();
      expect(image2).toHaveStyle({
        width: 1920,
        height: 1080,
      });
    });
    it('should retain inline style prior to attributes width and height to compute concrete dimensions', async () => {
      render(
        <HTMLImgElement
          width="1200"
          height="800"
          contentWidth={500}
          enableExperimentalPercentWidth
          style={{
            width: '50%',
            height: 100,
          }}
          source={{ uri: 'http://via.placeholder.com/1200x800' }}
        />
      );
      const image2 = await screen.findByTestId('image-success');
      expect(image2).toBeTruthy();
      expect(image2).toHaveStyle({
        width: 250,
        height: 100,
      });
    });
    it('should retain border-related style', async () => {
      const source = { uri: 'https://placehold.co/600x400' };
      const style = {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      };
      render(<HTMLImgElement source={source} style={style} />);
      const image = await screen.findByTestId('image-success');
      expect(image).toBeTruthy();
      expect(image).toHaveStyle({
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      });
    });
  });
});
