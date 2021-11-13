// https://github.com/jdeniau/ink-tab
import readline from "readline";
import { Box, BoxProps, Text, useStdin, TextProps } from "ink";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

/**
 * Represent props of a <Tab>
 */
export interface TabProps {
  name: string;
}

/**
 * Declare how does the keyboard interacts with ink-tab here
 */
interface KeyMapProps {
  useNumbers?: boolean;
  useTab?: boolean;
  previous?: string[];
  next?: string[];
}

/**
 * Props for the <Tabs> component
 */
export interface TabsProps {
  /**
   * A function called whenever a tab is changing.
   * @param {string} name the name of the tab passed in the `name` prop
   * @param {<TabProps>} activeTab the current active tab component
   */
  onChange(name: string, activeTab: ReactElement<typeof Tab>): void;
  children: ReactElement<typeof Tab>[];
  flexDirection?: BoxProps["flexDirection"];
  width?: BoxProps["width"];
  keyMap?: KeyMapProps;
  isFocused?: boolean;
  tabIndex?: number;
}

function useTabs(props: TabsProps) {
  const {
    isFocused = null, // isFocused is null mean that the focus not handle by ink
    children,
    width,
    onChange,
    tabIndex = 0,
    ...rest
  } = props;

  const defaultKeyMap = {
    useNumbers: true,
    useTab: true,
    previous: ["left"],
    next: ["right"],
  };

  const previousTabIndex = useRef(tabIndex);
  const { isRawModeSupported, stdin, setRawMode } = useStdin();
  const [activeTab, setActiveTab] = useState(tabIndex);

  useEffect(() => {
    if (previousTabIndex.current !== tabIndex) {
      setActiveTab(tabIndex);
    }
    previousTabIndex.current = tabIndex;
  }, [tabIndex]);

  const handleTabChange = useCallback(
    (tabId: number) => {
      const tab = children[tabId];
      if (!tab) return;
      setActiveTab(tabId);
      onChange(tab.props.name, tab);
    },
    [onChange, children]
  );

  const moveToPreviousTab = useCallback(() => {
    let nextTabId = activeTab - 1;
    if (nextTabId < 0) {
      nextTabId = children.length - 1;
    }
    handleTabChange(nextTabId);
  }, [activeTab, children, handleTabChange]);

  const moveToNextTab = useCallback(() => {
    let nextTabId = activeTab + 1;
    if (nextTabId >= children.length) {
      nextTabId = 0;
    }
    handleTabChange(nextTabId);
  }, [activeTab, children, handleTabChange]);

  const handleKeyPress = useCallback(
    (
      ch: string,
      key: null | { name: string; shift: boolean; meta: boolean }
    ) => {
      if (!key || isFocused === false) return;

      const currentKeyMap = { ...defaultKeyMap };
      const { useTab, previous, next } = currentKeyMap;

      if (previous.some((keyName) => keyName === key.name)) moveToPreviousTab();
      if (next.some((keyName) => keyName === key.name)) moveToNextTab();

      switch (key.name) {
        case "tab": {
          if (!useTab || isFocused !== null) return;

          if (key.shift === true) return moveToPreviousTab();

          return moveToNextTab();
        }

        default:
          break;
      }
    },
    [isFocused, moveToPreviousTab, moveToNextTab]
  );

  useEffect(() => {
    if (isRawModeSupported && stdin) {
      setRawMode(true);

      readline.emitKeypressEvents(stdin);
      stdin.addListener("keypress", handleKeyPress);

      return () => {
        setRawMode(false);
        stdin.removeListener("keypress", handleKeyPress);
      };
    }
  }, [isRawModeSupported, stdin, setRawMode, handleKeyPress]);

  return activeTab;
}

function Tabs(props: TabsProps) {
  const { width, children, isFocused, ...rest } = props;
  const activeTab = useTabs(props);

  return (
    <Box
      flexDirection={"row"}
      width={width}
      {...rest}
      justifyContent="space-between"
    >
      {children.map((child, key) => {
        const { name } = child.props;
        const isActive = activeTab === key;

        const textProps: TextProps = {
          backgroundColor: isActive ? "cyan" : undefined,
          color: isActive ? "black" : undefined,
        };

        return <Text {...textProps} key={name}>{` ${name} `}</Text>;
      })}
    </Box>
  );
}

/**
 * A <Tab> component
 */
function Tab({ name }: TabProps) {
  return <>{name}</>;
}

export { Tab, Tabs };
