import { Text, View } from "@react-pdf/renderer";

import { useStyleSheet } from "../helpers";

export interface HeaderProps {
  title: string;
  subject: string;
}

export default function ResumeHeader({
  title,
  subject,
}: HeaderProps): JSX.Element | null {
  const styles = useStyleSheet(({ colors, texts }) => ({
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
  }));

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
  );
}
