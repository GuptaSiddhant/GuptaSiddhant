import { formatDate } from "@gs/utils/format"
import { StyleSheet, Text, View } from "@react-pdf/renderer"

import { colors, texts } from "../theme"

export interface FooterProps {}

export default function Footer(_: FooterProps): JSX.Element | null {
  return (
    <View style={styles.header} fixed>
      <Text style={styles.headerText}>{formatDate(new Date())}</Text>
      <Text
        style={styles.headerText}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} / ${totalPages}`
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
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
  headerText: {
    ...texts.small,
    color: colors.textDisabled,
  },
})
