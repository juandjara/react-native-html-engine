import {
  defaultHTMLElementModels,
  HTMLContentModel,
  TBlock,
} from '@native-html/transient-render-engine';
import { render, screen } from '@testing-library/react-native';
import RenderHTML from '../RenderHTML';
import { CustomRendererProps } from '../shared-types';

describe('RenderHTML a11y', () => {
  describe('regarding anchors', () => {
    describe('should add accessibility features to anchors when href is non-empty', () => {
      const snippets = [
        // Block
        `<a href="https://domain.com">test</a>`,
        // Inline
        `<span><a href="https://domain.com">test</a> other text</span>`,
      ];
      for (const snippet of snippets) {
        it(`should pas snippet "${snippet}"`, () => {
          const element = (
            <RenderHTML
              source={{
                html: snippet,
              }}
              debug={false}
              contentWidth={0}
            />
          );
          render(element);
          const anchor = screen.getByTestId('a');
          expect(anchor).toHaveProp('accessibilityRole', 'link');
          expect(anchor).toHaveProp('accessible', true);
          // TODO: expect(element).toBeAccessible();
        });
      }
    });
    it('should not add accessibility features to anchors when href is empty', () => {
      const element = (
        <RenderHTML
          source={{
            html: `<a href="">test</a>`,
          }}
          debug={false}
          contentWidth={0}
        />
      );
      render(element);
      const anchor = screen.getByTestId('a');
      expect(anchor).not.toHaveProp('accessibilityRole');
      expect(anchor).not.toHaveProp('accessible');
      // TODO: expect(element).toBeAccessible();
    });
  });
  describe('regarding headings', () => {
    it("should add accessibility role 'header' to headings", () => {
      for (const header of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
        const element = (
          <RenderHTML
            source={{
              html: `<${header}>test</${header}>`,
            }}
            debug={false}
            contentWidth={0}
          />
        );
        render(element);
        expect(screen.getByTestId(header)).toHaveProp(
          'accessibilityRole',
          'header'
        );
        // TODO: expect(element).toBeAccessible();
      }
    });
  });
  describe('regarding images', () => {
    it('should provide accessibility properties to <img> renderer when alt attribute is defined', async () => {
      const element = (
        <RenderHTML
          source={{
            html: '<img alt="An image" src="https://img.com/1x1" />',
          }}
          debug={false}
          contentWidth={200}
        />
      );
      render(element);
      await screen.findByTestId('image-success');
      const image = screen.getByLabelText('An image');
      expect(image).toHaveProp('accessibilityRole', 'image');

      // Waiting for AccessibilityEngine to support async udpates
      // see https://github.com/aryella-lacerda/react-native-accessibility-engine/issues/97
      // await waitFor(() =>
      //   expect(() => AccessibilityEngine.check(element)).not.toThrow()
      // );
    });
    it('<img> should not be accessible when alt attribute is missing', async () => {
      const element = (
        <RenderHTML
          source={{
            html: '<img src="https://img.com/1x1" />',
          }}
          debug={false}
          contentWidth={200}
        />
      );
      render(element);
      await screen.findByTestId('image-success');
      const image = screen.getByTestId('img');
      expect(image).toHaveProp('accessibilityRole', 'none');
      expect(image).not.toHaveProp('accessibilityLabel');

      // TODO: expect(element).toBeAccessible();
    });
  });
  describe('regarding pressable custom renderers', () => {
    it('should add a button role if onPress is defined for custom renderers with a block content model', () => {
      const element = (
        <RenderHTML
          source={{
            html: '<button aria-label="Click me!"></button>',
          }}
          customHTMLElementModels={{
            ...defaultHTMLElementModels,
            button: defaultHTMLElementModels.button.extend({
              contentModel: HTMLContentModel.block,
            }),
          }}
          renderers={{
            button: ({
              TDefaultRenderer,
              ...props
            }: CustomRendererProps<TBlock>) => (
              <TDefaultRenderer onPress={() => {}} {...props} />
            ),
          }}
          debug={false}
          contentWidth={200}
        />
      );
      render(element);
      const button = screen.getByRole('button');
      expect(button).toHaveProp('accessibilityRole', 'button');
      // TODO: expect(element).toBeAccessible();
    });
    it('should add a button role if onPress is defined for custom renderers with a textual content model', () => {
      const element = (
        <RenderHTML
          source={{
            html: '<span><customlink aria-label="Click me!"></customlink></span>',
          }}
          customHTMLElementModels={{
            ...defaultHTMLElementModels,
            customlink: defaultHTMLElementModels.span,
          }}
          renderers={{
            customlink: ({
              TDefaultRenderer,
              ...props
            }: CustomRendererProps<any>) => (
              <TDefaultRenderer onPress={() => {}} {...props} />
            ),
          }}
          debug={false}
          contentWidth={200}
        />
      );
      render(element);
      const button = screen.getByRole('link');
      expect(button).toHaveProp('accessibilityRole', 'link');
      // TODO: expect(element).toBeAccessible();
    });
  });
});
