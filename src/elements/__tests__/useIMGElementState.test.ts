import { renderHook, waitFor } from '@testing-library/react-native';
import useIMGElementState from '../useIMGElementState';
import { Image } from 'react-native';

const renderHookWithCount = (hook: () => any) => {
  let count = 0
  const getCount = () => count
  const view = renderHook(() => {
    count ++
    return hook()
  })
  return {getCount, ...view}
}

describe('useIMGElementState', () => {
  const props = {
    contentWidth: 300,
    source: { uri: 'https://foo.bar/600x300' },
    initialDimensions: { width: 30, height: 30 },
    computeMaxWidth: (contentWidth: number) => contentWidth
  };
  it('should render at most twice when width and height physical dimensions are not provided, prior and after fetching physical dimensions', async () => {
    const { getCount, result } = renderHookWithCount(() => useIMGElementState(props));
    await waitFor(() => {
      expect(result.current.type).toEqual('success');
    });
    expect(getCount()).toBeLessThanOrEqual(2);
  });
  it('should use Image.getSizeWithHeaders when source has `headers`', async () => {
    const source = { uri: 'https://placehold.co/600x400', headers: {} };
    const localProps = { ...props, source };
    const { result, getCount } = renderHookWithCount(() => useIMGElementState(localProps));
    await waitFor(() => {
      expect(result.current.type).toEqual('success');
    });
    expect(Image.getSizeWithHeaders).toHaveBeenCalled();
    expect(getCount()).toBeLessThanOrEqual(2);
  });
  it('should render once when width and height physical dimensions are provided, bypassing the fetching of physical dimensions', async () => {
    const { result, getCount } = renderHookWithCount(() =>
      useIMGElementState({
        ...props,
        width: 600,
        height: 300
      })
    );
    await waitFor(() => {
      expect(result.current.type).toEqual('success');
    });
    expect(getCount()).toBe(1);
  });
  it('should start in loading state with dimensions set to initialDimensions', async () => {
    const { result } = renderHook(() => useIMGElementState(props));
    expect(result.current.type).toEqual('loading');
    expect(result.current.dimensions).toMatchObject({
      width: 30,
      height: 30
    });
  });
  it('should update to success state with dimensions set to scaled physical image dimensions', async () => {
    const { result } = renderHook(() => useIMGElementState(props));
    // NOTE: adapted with tips from here: https://github.com/testing-library/react-testing-library/issues/1101
    await waitFor(() => {
      expect(result.current.type).toEqual('success');
    });
    expect(result.current.dimensions).toMatchObject({
      width: 300,
      height: 150
    });
  });
  it('should support cachedNaturalDimensions prop', async () => {
    // @ts-ignore for testing purposes
    Image.getSizeWithHeaders = jest.fn();
    const { result } = renderHook(() =>
      useIMGElementState({
        ...props,
        cachedNaturalDimensions: {
          width: 600,
          height: 300
        },
      })
    );
    expect(result.current.type).toEqual('success');
    expect(result.current.dimensions).toMatchObject({
      width: 300,
      height: 150
    });
    expect(Image.getSizeWithHeaders).not.toHaveBeenCalled();
  });
});
