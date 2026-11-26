import { useEffect, useState } from "react";
import { RiSearch2Line as Icon } from "@remixicon/react";

export default function SearchButton() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const userAgent: string = window.navigator?.userAgent || "unknown";
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(userAgent));
  }, []);

  const title = `Search [${isMac ? "Cmd" : "Win"}+K]`;

  return (
    <span title={title}>
      <Icon />
    </span>
  );
}
