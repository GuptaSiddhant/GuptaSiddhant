import { Text, View } from "@react-pdf/renderer"

import { formatDate } from "@gs/utils/format"

import { useStyleSheet } from "../helpers"

export interface FooterProps {}

export default function ResumeFooter(_: FooterProps): JSX.Element | null {
  const styles = useStyleSheet(({ texts, colors }) => ({
    footer: {
      marginHorizontal: 32,
      paddingTop: 8,
      paddingBottom: 8,
      marginBottom: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    footerText: {
      ...texts.small,
      color: colors.textDisabled,
    },
  }))

  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{formatDate(new Date())}</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} / ${totalPages}`
        }
      />
    </View>
  )
}
