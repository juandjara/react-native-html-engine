import React, { FunctionComponent, memo, ReactElement } from 'react';
import {
  TDefaultRenderer,
  TDefaultRendererProps,
  TNodeRendererProps,
} from './shared-types';
import { useSharedProps } from './context/SharedPropsProvider';
import {
  TText,
  TBlock,
  TNode,
  TPhrasing,
} from '@native-html/transient-render-engine';
import useAssembledCommonProps from './hooks/useAssembledCommonProps';
import { useTNodeChildrenRenderer } from './context/TChildrenRendererContext';
import renderTextualContent from './renderTextualContent';
import { useRendererRegistry } from './context/RenderRegistryProvider';
import renderBlockContent from './renderBlockContent';
import renderEmptyContent from './renderEmptyContent';
import { TNodeSubRendererProps } from './internal-types';

export type { TNodeRendererProps } from './shared-types';

const TDefaultBlockRenderer: TDefaultRenderer<TBlock> =
  renderBlockContent.bind(null);

TDefaultBlockRenderer.displayName = 'TDefaultBlockRenderer';

const TDefaultPhrasingRenderer: TDefaultRenderer<TPhrasing> =
  renderTextualContent.bind(null);

TDefaultPhrasingRenderer.displayName = 'TDefaultPhrasingRenderer';

const TDefaultTextRenderer: TDefaultRenderer<TText> =
  renderTextualContent.bind(null);

TDefaultTextRenderer.displayName = 'TDefaultTextRenderer';

function isGhostTNode(tnode: TNode) {
  return (
    (tnode.type === 'text' && (tnode.data === '' || tnode.data === ' ')) ||
    tnode.type === 'empty'
  );
}

/**
 * A component to render any {@link TNode}.
 */
const TNodeRenderer = memo(function MemoizedTNodeRenderer<T extends TNode>(
  props: TNodeRendererProps<T>
): ReactElement | null {
  const { tnode } = props;
  const sharedProps = useSharedProps();
  const renderRegistry = useRendererRegistry();
  const TNodeChildrenRenderer = useTNodeChildrenRenderer();
  const tnodeProps = {
    propsFromParent: { collapsedMarginTop: null },
    ...props,
    TNodeChildrenRenderer,
    sharedProps,
  };
  const renderer =
    tnode.type === 'block' || tnode.type === 'document'
      ? TDefaultBlockRenderer
      : tnode.type === 'text'
        ? TDefaultTextRenderer
        : tnode.type === 'phrasing'
          ? TDefaultPhrasingRenderer
          : renderEmptyContent;

  const { assembledProps, Renderer } = useAssembledCommonProps<T>(
    tnodeProps,
    renderer as TDefaultRenderer<T>
  );
  switch (tnode.type) {
    case 'empty':
      if (tnode.isUnregistered) {
        break;
      } else {
        return renderEmptyContent(assembledProps);
      }
    case 'text':
      const InternalTextRenderer = renderRegistry.getInternalTextRenderer(
        props.tnode.tagName
      );

      if (InternalTextRenderer) {
        return React.createElement(
          InternalTextRenderer,
          tnodeProps as TNodeSubRendererProps<TText>
        );
      }
      // If ghost line prevention is enabled and the text data is empty, render
      // nothing to avoid React Native painting a 20px height line.
      // See also https://git.io/JErwX
      if (
        (tnodeProps.tnode as TText).data === '' &&
        (tnodeProps.tnode as TText).tagName == null &&
        tnodeProps.sharedProps.enableExperimentalGhostLinesPrevention
      ) {
        return null;
      }
      break;
    case 'phrasing':
      // When a TPhrasing node is anonymous and has only one child, its
      // rendering amounts to rendering its only child.
      if (
        tnodeProps.sharedProps.bypassAnonymousTPhrasingNodes &&
        tnodeProps.tnode.tagName == null &&
        tnodeProps.tnode.children.length <= 1
      ) {
        return React.createElement(TNodeChildrenRenderer, {
          tnode: props.tnode,
        });
      }
      // If ghost line prevention is enabled and the tnode is an anonymous empty
      // phrasing node, render nothing to avoid React Native painting a 20px
      // height line. See also https://git.io/JErwX
      if (
        tnodeProps.sharedProps.enableExperimentalGhostLinesPrevention &&
        tnodeProps.tnode.tagName == null &&
        tnodeProps.tnode.children.every(isGhostTNode)
      ) {
        return null;
      }
      break;
  }

  if (Renderer !== null) {
    return React.createElement(
      Renderer as FunctionComponent<typeof assembledProps>,
      assembledProps
    );
  }

  if (tnode.type === 'block' || tnode.type === 'document') {
    return renderBlockContent(assembledProps as TDefaultRendererProps<TBlock>);
  }

  return renderTextualContent(
    assembledProps as TDefaultRendererProps<TPhrasing | TText>
  );
});

export {
  TDefaultBlockRenderer,
  TDefaultPhrasingRenderer,
  TDefaultTextRenderer,
};

export default TNodeRenderer;
