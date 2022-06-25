import { Link, StyleSheet, Text, View } from "@react-pdf/renderer"

import { colors, texts } from "./theme"
import type { BasePdfProps } from "./types"

export interface CardProps extends BasePdfProps {
  title: string
  subtitle: string
  dateline: string
  link: string
  description?: string
}

export default function Card({
  style = {},
  title,
  subtitle,
  dateline,
  link,
  description,
}: CardProps): JSX.Element {
  return (
    <View style={[styles.container, style]} wrap={false}>
      <View style={styles.leftColumn}>
        <Text style={styles.datelineText} hyphenationCallback={(w) => [w]}>
          {dateline}
        </Text>
      </View>

      <View style={styles.rightColumn}>
        <Link src={link} style={{ textDecoration: "none" }}>
          <Text style={styles.titleText} {...({ bookmark: title } as any)}>
            {title}
          </Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </Link>
        {description ? (
          <Text style={styles.descriptionText}>{description}</Text>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginTop: 8, flexDirection: "row" },
  leftColumn: { width: "30%", marginVertical: 4, marginRight: 8 },
  datelineText: { color: colors.textDisabled },
  rightColumn: { flex: 1 },
  titleText: {
    ...texts.h6,
    marginVertical: 4,
    color: colors.textSecondary,
  },
  subtitleText: { color: colors.textPrimary },
  descriptionText: { color: colors.textDisabled, marginTop: 4 },
})
