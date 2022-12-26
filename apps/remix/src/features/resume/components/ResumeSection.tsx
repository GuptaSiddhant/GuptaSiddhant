import { Text, View } from "@react-pdf/renderer"

import { useStyleSheet } from "../helpers"
import type { BasePdfProps } from "../types"

export interface SectionProps extends BasePdfProps {
  title?: string
  disable?: boolean
  wrap?: boolean
}

export default function ResumeSection({
  children,
  style = {},
  title,
  disable = false,
  wrap = true,
}: SectionProps): JSX.Element | null {
  const styles = useStyleSheet(({ texts, colors }) => ({
    section: {
      marginBottom: 32,
      marginHorizontal: 32,
    },
    titleText: { ...texts.h2, marginVertical: 4, color: colors.black },
  }))

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
