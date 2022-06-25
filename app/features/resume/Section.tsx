import { StyleSheet, Text, View } from "@react-pdf/renderer"

import { texts } from "./theme"
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
    <View
      style={[styles.section, style]}
      wrap={false}
      {...({ bookmark: title } as any)}
    >
      <Text style={styles.titleText}>{title}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
    marginHorizontal: 32,
  },
  titleText: { ...texts.h2, marginVertical: 4 },
})
