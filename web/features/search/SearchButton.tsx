import { useEffect, useState } from "react"
import SearchIcon from "remixicon-react/Search2LineIcon"

import Button from "../ui/Button"
import useSearch from "."

export default function SearchButton() {
  const { toggleSearchOpen } = useSearch()
  const [isMac, setIsMac] = useState(false)

  // useEffect(() => openSearch(), [openSearch])

  useEffect(() => {
    const userAgent: string = window.navigator?.userAgent || "unknown"
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(userAgent))
  }, [])

  const title = "Search [" + (isMac ? "Cmd" : "Win") + "+K]"

  return (
    <Button onClick={toggleSearchOpen} title={title}>
      <SearchIcon />
    </Button>
  )
}

export { SearchIcon }
