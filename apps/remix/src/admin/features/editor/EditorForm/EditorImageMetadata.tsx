import clsx from "clsx";
import { startTransition, useCallback, useState } from "react";

import Button from "@gs/ui/Button";
import {
  type BlurhashData,
  encodeImageToBlurhash,
} from "@gs/utils/blurhash.client";

export default function EditorImageMetadata(props: {
  imageUrl: string | undefined;
  setMetadata: (value: BlurhashData) => void;
  prefix: string | undefined;
  metadata?: BlurhashData;
}): JSX.Element | null {
  const { imageUrl, prefix, setMetadata, metadata } = props;
  const [loading, setLoading] = useState(false);

  const handleBlur = useCallback(
    async (url?: string) => {
      setLoading(true);
      startTransition(() => {
        encodeImageToBlurhash(url)
          .then(setMetadata)
          .finally(() => setLoading(false));
      });
    },
    [setMetadata],
  );

  if (!imageUrl) return null;
  const isHashGenerated = !!metadata?.hash;

  return (
    <div className={clsx("relative flex gap-2 items-end")}>
      <img
        src={imageUrl}
        alt={prefix}
        crossOrigin="anonymous"
        className="h-14 aspect-square rounded-sm bg-inverse object-cover"
      />
      {isHashGenerated ? (
        <Button.Secondary onClick={() => handleBlur(imageUrl)}>
          {loading ? "..." : "Gen#"}
        </Button.Secondary>
      ) : (
        <Button.Primary onClick={() => handleBlur(imageUrl)}>
          {loading ? "..." : "Gen#"}
        </Button.Primary>
      )}

      {metadata &&
        Object.entries(metadata).map(([key, value]) => (
          <input
            type="hidden"
            key={key}
            name={[prefix, "metadata", key].filter(Boolean).join(".")}
            value={value}
            readOnly
          />
        ))}
    </div>
  );
}
