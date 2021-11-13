import { Box } from "ink";
import { useEffect, useState } from "react";
import { WindowSizeContext } from "../helpers/useWindowSize";
import type { BoxProps } from "ink";
import type { PropsWithChildren } from "react";

export default function Fullscreen({
  children,
  ...props
}: PropsWithChildren<BoxProps>): JSX.Element {
  const [size, setSize] = useState({
    width: process.stdout.columns,
    height: process.stdout.rows,
  });

  useEffect(() => {
    function onResize() {
      setSize({
        width: process.stdout.columns,
        height: process.stdout.rows,
      });
    }

    process.stdout.on("resize", onResize);
    process.stdout.write("\x1b[?1049h");
    onResize();
    return () => {
      process.stdout.off("resize", onResize);
      process.stdout.write("\x1b[?1049l");
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={size}>
      <Box {...props} {...size}>
        {children}
      </Box>
    </WindowSizeContext.Provider>
  );
}
