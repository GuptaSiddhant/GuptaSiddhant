import { StyleSheet, Text, View } from "@react-pdf/renderer"

import { colors } from "./theme"
import type { BasePdfProps } from "./types"

export interface SectionProps extends BasePdfProps {
  title: string
}

export default function Section({
  children,
  style = {},
  title,
}: SectionProps): JSX.Element {
  return (
    <View style={[styles.section, style]}>
      <Text style={styles.titleText}>{title}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 32,
  },
  titleText: {
    fontFamily: "Courier-Bold",
    fontSize: 24,
  },
})
