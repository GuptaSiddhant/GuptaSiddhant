import { StyleSheet, Text, View } from "@react-pdf/renderer"

import { colors, texts } from "./theme"
import type { BasePdfProps } from "./types"

export interface CardProps extends BasePdfProps {
  title: string
}

export default function Card({
  children,
  style = {},
  title,
}: CardProps): JSX.Element {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.subtitleText}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  titleText: { ...texts.h6, marginVertical: 4, color: colors.textSecondary },
  subtitleText: { color: colors.textSecondary },
})
