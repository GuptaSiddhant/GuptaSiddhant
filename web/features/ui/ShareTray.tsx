import FacebookIcon from "remixicon-react/FacebookCircleFillIcon";
import LinkedInIcon from "remixicon-react/LinkedinBoxFillIcon";
import TweetIcon from "remixicon-react/TwitterFillIcon";
import ShareIcon from "remixicon-react/ShareBoxLineIcon";

import { appLogger } from "@gs/service/logger.server";
import Button, { CopyButton } from "./Button";
import { ExternalLink } from "./Link";

export interface ShareTrayProps {
  url: string;
  title?: string;
}

export default function ShareTray(props: ShareTrayProps): JSX.Element | null {
  if (!props.url) {
    return null;
  }

  return (
    <div className="flex-end flex items-center gap-4">
      <FacebookShareButton {...props} />
      <LinkedInShareButton {...props} />
      <TweetButton {...props} />
      <ShareButton {...props} />
      <CopyButton>{props.url}</CopyButton>
    </div>
  );
}

function ShareButton(data: ShareTrayProps): JSX.Element | null {
  if (!("share" in navigator)) return null;
  if (!navigator.canShare(data)) return null;

  return (
    <Button
      title="Share"
      onClick={() => navigator.share(data).catch(appLogger.error)}
    >
      <ShareIcon />
    </Button>
  );
}

function TweetButton({ url }: ShareTrayProps): JSX.Element | null {
  const searchParams = new URLSearchParams({
    url,
    text: "Check out this article by @guptasiddhant9",
  });
  const link = `https://twitter.com/intent/tweet?${searchParams.toString()}`;
  const label = "Tweet this article";

  return (
    <ExternalLink href={link} tooltipLabel={label}>
      <TweetIcon />
      <span className="sr-only">{label}</span>
    </ExternalLink>
  );
}

function LinkedInShareButton({
  url,
  title = "",
}: ShareTrayProps): JSX.Element | null {
  const searchParams = new URLSearchParams({ url, title });
  const link = `https://www.linkedin.com/sharing/share-offsite/?${searchParams.toString()}`;
  const label = "Share on LinkedIn";

  return (
    <ExternalLink href={link} tooltipLabel={label}>
      <LinkedInIcon />
      <span className="sr-only">{label}</span>
    </ExternalLink>
  );
}

function FacebookShareButton({ url }: ShareTrayProps): JSX.Element | null {
  const searchParams = new URLSearchParams({ u: url });
  const link = `https://www.facebook.com/sharer/sharer.php?${searchParams.toString()}`;
  const label = "Share on Facebook";

  return (
    <ExternalLink href={link} tooltipLabel={label}>
      <FacebookIcon />
      <span className="sr-only">{label}</span>
    </ExternalLink>
  );
}
