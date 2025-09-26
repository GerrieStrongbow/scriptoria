import React from 'react';
import renderer, { act } from 'react-test-renderer';
import type { ReactTestRenderer, ReactTestInstance } from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';
import DocumentListItem from '../documents/DocumentListItem';
import RenameDocumentModal from '../documents/RenameDocumentModal';
import type { DocumentRecord } from '../../services/documentService';

jest.mock('react-native-vector-icons/Feather', () => 'FeatherIcon');

const baseTimestamp = new Date('2024-01-01T12:00:00Z').getTime();

const sampleDocument: DocumentRecord = {
  id: 'doc-1',
  displayName: 'Sample Document',
  isMultiPage: true,
  pageCount: 2,
  pages: [
    { path: '/tmp/doc-1-page-1.jpg', name: 'Sample_Document_page_1.jpg', pageNumber: 1, mtime: baseTimestamp },
    { path: '/tmp/doc-1-page-2.jpg', name: 'Sample_Document_page_2.jpg', pageNumber: 2, mtime: baseTimestamp },
  ],
  primaryPage: { path: '/tmp/doc-1-page-1.jpg', name: 'Sample_Document_page_1.jpg', pageNumber: 1, mtime: baseTimestamp },
  metadataPath: null,
  metadata: null,
  createdAt: baseTimestamp,
  updatedAt: baseTimestamp,
};

describe('Document components', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders DocumentListItem and handles presses', () => {
    const onPress = jest.fn();
    const onMenuPress = jest.fn();

    let tree: ReactTestRenderer | undefined;

    act(() => {
      tree = renderer.create(
        <DocumentListItem document={sampleDocument} onPress={onPress} onMenuPress={onMenuPress} />,
      );
    });

    if (!tree) {
      throw new Error('DocumentListItem failed to mount');
    }

    const mountedTree: ReactTestRenderer = tree;

    const json = JSON.stringify(mountedTree.toJSON());
    expect(json).toContain('Sample Document');

    const textNodes = mountedTree.root.findAllByType(Text);
    const annotationNode = textNodes.find((node: ReactTestInstance) => {
      const style = node.props.style;
      if (!Array.isArray(style)) {
        return false;
      }
      return style.some(item => item?.fontStyle === 'italic');
    });

    const annotationContent = Array.isArray(annotationNode?.props.children)
      ? annotationNode?.props.children.join('')
      : annotationNode?.props.children;

    expect(annotationContent).toContain('2');
    expect(annotationContent).toContain('pages');

    const touchables = mountedTree.root.findAllByType(TouchableOpacity);

    act(() => {
      touchables[0].props.onPress();
    });
    expect(onPress).toHaveBeenCalledTimes(1);

    act(() => {
      touchables[1].props.onPress({ stopPropagation: jest.fn() });
    });
    expect(onMenuPress).toHaveBeenCalledTimes(1);
    act(() => {
      mountedTree.unmount();
    });
  });

  it('handles RenameDocumentModal actions', () => {
    const handleRename = jest.fn();
    const handleCancel = jest.fn();

    let tree: ReactTestRenderer | undefined;

    act(() => {
      tree = renderer.create(
        <RenameDocumentModal
          visible
          value="Initial"
          onChangeText={() => {}}
          onRename={handleRename}
          onCancel={handleCancel}
        />,
      );
    });

    if (!tree) {
      throw new Error('RenameDocumentModal failed to mount');
    }

    const mountedTree: ReactTestRenderer = tree;

    const touchables = mountedTree.root.findAllByType(TouchableOpacity);

    act(() => {
      touchables[0].props.onPress();
    });
    expect(handleRename).toHaveBeenCalledTimes(1);

    act(() => {
      touchables[1].props.onPress();
    });
    expect(handleCancel).toHaveBeenCalledTimes(1);
    act(() => {
      mountedTree.unmount();
    });
  });
});
