import { Link, StyleSheet, Text, View } from "@react-pdf/renderer"

import { colors, texts } from "./theme"
import type { BasePdfProps } from "./types"

export interface CardProps extends BasePdfProps {
  title?: string
  subtitle?: string
  caption?: string
  link?: string
}

export default function Card({
  style = {},
  title,
  subtitle,
  caption,
  link = "#",
  children,
}: CardProps): JSX.Element {
  return (
    <View style={[styles.container, style]} wrap={false}>
      <View style={styles.leftColumn}>
        <Text style={styles.captionText} hyphenationCallback={(w) => [w]}>
          {caption}
        </Text>
      </View>

      <View style={styles.rightColumn}>
        <Link src={link} style={{ textDecoration: "none" }}>
          {title ? (
            <Text style={styles.titleText} {...({ bookmark: title } as any)}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={styles.subtitleText}>{subtitle}</Text>
          ) : null}
        </Link>
        {children ? (
          <Text style={styles.descriptionText}>{children}</Text>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginTop: 8, flexDirection: "row" },
  leftColumn: { width: "30%", marginVertical: 4, marginRight: 8 },
  captionText: { color: colors.textDisabled },
  rightColumn: { flex: 1 },
  titleText: {
    ...texts.h6,
    marginVertical: 4,
    color: colors.textSecondary,
  },
  subtitleText: { color: colors.textPrimary },
  descriptionText: { color: colors.textDisabled, marginTop: 4 },
})
