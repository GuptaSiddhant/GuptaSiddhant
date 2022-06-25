import { Link, StyleSheet, Text, View } from "@react-pdf/renderer"

import { colors, texts } from "./theme"
import type { ContactLinkProps } from "./types"

export interface HeroProps {
  title: string
  subtitle: string
  contactLinks: ContactLinkProps[]
  children?: React.ReactNode
}

export default function Hero({
  title,
  subtitle,
  contactLinks,
  children,
}: HeroProps): JSX.Element | null {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[texts.h1, { marginHorizontal: 8 }]}>{title}</Text>
        <Text style={[texts.h5, { marginHorizontal: 8 }]}>{subtitle}</Text>
        {children}
      </View>
      <ContactBox links={contactLinks} />
    </View>
  )
}

function ContactBox({ links }: { links: ContactLinkProps[] }): JSX.Element {
  const maxKeyLength = Math.max(...links.map(({ key }) => key.length))

  return (
    <View
      style={{
        justifyContent: "flex-end",
        height: "100%",
        paddingBottom: 0,
        paddingRight: 8,
      }}
    >
      {links.map(({ key, value, linkUrl }) => (
        <Text key={key} style={styles.text}>
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
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgFloat,
    margin: 16,
    padding: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: { marginTop: 8 },
  textKey: {
    color: colors.textDisabled,
  },
  text: {
    fontSize: 12,
    fontFamily: "Courier",
    lineHeight: 1.2,
    color: colors.textSecondary,
    textDecoration: "none",
  },
})
