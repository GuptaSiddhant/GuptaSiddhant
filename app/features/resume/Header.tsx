import { StyleSheet, Text, View } from "@react-pdf/renderer"

import { colors, texts } from "./theme"

export interface HeaderProps {
  title: string
  subject: string
}

export default function Header({
  title,
  subject,
}: HeaderProps): JSX.Element | null {
  return (
    <View
      fixed
      style={styles.headerContainer}
      render={({ pageNumber }) =>
        pageNumber > 1 ? (
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.headerText}>{subject}</Text>
          </View>
        ) : null
      }
    />
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    ...texts.small,
    color: colors.textDisabled,
  },
})
