import { StyleSheet, Text, View } from "@react-pdf/renderer"

import { texts } from "../theme"
import type { BasePdfProps } from "../types"

export interface SectionProps extends BasePdfProps {
  title?: string
  disable?: boolean
  wrap?: boolean
}

export default function Section({
  children,
  style = {},
  title,
  disable = false,
  wrap = true,
}: SectionProps): JSX.Element | null {
  if (disable) return null

  return (
    <View
      wrap={wrap}
      style={[styles.section, style]}
      {...({ bookmark: title } as any)}
    >
      {title ? <Text style={styles.titleText}>{title}</Text> : null}
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
