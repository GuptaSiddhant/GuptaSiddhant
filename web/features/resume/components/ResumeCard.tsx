import { Link, Text, View } from "@react-pdf/renderer"

import { useStyleSheet } from "../helpers"
import type { BasePdfProps } from "../types"

export interface ResumeCardProps extends BasePdfProps {
  title?: string
  subtitle?: string
  caption?: string
  link?: string
}

export default function ResumeCard({
  style = {},
  title,
  subtitle,
  caption,
  link = "#",
  children,
}: ResumeCardProps): JSX.Element {
  const styles = useStyleSheet(({ texts, colors }) => ({
    container: { marginTop: 8, flexDirection: "row" },
    leftColumn: { width: "30%", marginVertical: 4, marginRight: 8 },
    captionText: { ...texts.small, color: colors.textDisabled },
    rightColumn: { flex: 1 },
    titleText: {
      ...texts.h6,
      marginVertical: 4,
      color: colors.textSecondary,
    },
    subtitleText: { color: colors.textPrimary },
    descriptionText: {
      ...texts.small,
      color: colors.textDisabled,
      marginTop: 4,
    },
  }))

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
