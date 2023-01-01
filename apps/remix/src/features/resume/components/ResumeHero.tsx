import { Link, Text, View } from "@react-pdf/renderer";

import { useStyleSheet } from "../helpers";
import type { ContactLinkProps } from "../types";

export interface HeroProps {
  title: string;
  subtitle: string;
  contactLinks: ContactLinkProps[];
  children?: React.ReactNode;
}

export default function Hero({
  title,
  subtitle,
  contactLinks,
  children,
}: HeroProps): JSX.Element | null {
  const styles = useStyleSheet(({ colors, texts }) => ({
    container: {
      backgroundColor: colors.bgFloat,
      margin: 16,
      padding: 16,
      borderTopLeftRadius: 8,
      borderBottomRightRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottom: 1,
      borderBottomColor: colors.border,
    },
    titleContainer: { marginTop: 8 },
    title: { ...texts.h1, color: colors.black },
    subtitle: { ...texts.h5, color: colors.black },
    codeBlock: { ...texts.mono, marginTop: 16 },
    codeComment: { ...texts.mono, color: colors.textDisabled },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Text style={styles.codeBlock}>
          <Text style={styles.codeComment}>$</Text> {children}
        </Text>
      </View>
      <ContactBox links={contactLinks} />
    </View>
  );
}

function ContactBox({ links }: { links: ContactLinkProps[] }): JSX.Element {
  const maxKeyLength = Math.max(...links.map(({ key }) => key.length));
  const styles = useStyleSheet(({ colors }) => ({
    contactContainer: {
      justifyContent: "flex-end",
      height: "100%",
    },
    textKey: {
      color: colors.textDisabled,
    },
    text: {
      color: colors.textSecondary,
      textDecoration: "none",
    },
  }));

  return (
    <View style={styles.contactContainer}>
      {links.map(({ key, value, linkUrl }) => (
        <Text key={key} style={[styles.text]}>
          <Text style={styles.textKey}>{key.padEnd(maxKeyLength)}:</Text>{" "}
          {linkUrl ? (
            <Link src={linkUrl} style={styles.text}>
              {value}
            </Link>
          ) : (
            value
          )}
        </Text>
      ))}
    </View>
  );
}
