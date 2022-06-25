import { StyleSheet, Text } from "@react-pdf/renderer"

import { colors } from "./theme"
import type { BasePdfProps } from "./types"

export interface TerminalProps extends BasePdfProps {}

export default function Terminal({
  children,
  style = {},
}: TerminalProps): JSX.Element {
  return (
    <Text style={[styles.terminalText, style]}>
      <Text style={{ color: colors.textDisabled }}>$</Text> {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  terminalText: {
    marginHorizontal: 0,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.bgInput,
    fontSize: 12,
    fontFamily: "Courier",
  },
})
