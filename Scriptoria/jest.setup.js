/* eslint-env jest */

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock has a default export which is a function. Ensure "call" is a no-op to avoid warnings.
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');

  const renderWithView = (props) => {
    const { children, ...rest } = props || {};
    return React.createElement(View, rest, children);
  };

  return {
    SafeAreaProvider: renderWithView,
    SafeAreaView: renderWithView,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockModal = React.forwardRef((props, ref) => {
    const { visible, children, ...rest } = props || {};
    if (!visible) {
      return null;
    }

    return React.createElement(View, { ref, ...rest }, children);
  });

  return { default: MockModal };
});

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: {
    open: jest.fn(),
    shareSingle: jest.fn(),
    Social: {},
  },
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');

  const renderChildren = (props) => {
    const { children } = props || {};
    return React.createElement(React.Fragment, null, children);
  };

  return {
    __esModule: true,
    NavigationContainer: renderChildren,
    useNavigation: () => ({ navigate: jest.fn(), setOptions: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');

  return {
    __esModule: true,
    createStackNavigator: () => {
      const wrapChildren = (props) => {
        const { children } = props || {};
        return React.createElement(React.Fragment, null, children);
      };

      return { Navigator: wrapChildren, Screen: wrapChildren };
    },
  };
});

jest.mock('react-native-fs', () => {
  const fsMock = {
    DocumentDirectoryPath: '/mock/Documents',
    CachesDirectoryPath: '/mock/Caches',
    exists: jest.fn().mockResolvedValue(false),
    mkdir: jest.fn().mockResolvedValue(undefined),
    readDir: jest.fn().mockResolvedValue([]),
    readFile: jest.fn().mockResolvedValue(''),
    moveFile: jest.fn().mockResolvedValue(undefined),
    unlink: jest.fn().mockResolvedValue(undefined),
    copyFile: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined),
    stat: jest.fn().mockResolvedValue({ isFile: () => true, isDirectory: () => false }),
  };

  return {
    __esModule: true,
    ...fsMock,
    default: fsMock,
  };
});

jest.mock('react-native-images-to-pdf', () => ({
  __esModule: true,
  createPdf: jest.fn().mockResolvedValue({ filePath: '/mock/output.pdf' }),
}));
