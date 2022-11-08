import FacebookIcon from "remixicon-react/FacebookCircleFillIcon";
import LinkedInIcon from "remixicon-react/LinkedinBoxFillIcon";
import TweetIcon from "remixicon-react/TwitterFillIcon";

import { CopyButton } from "./Button";
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
      <CopyButton>{props.url}</CopyButton>
    </div>
  );
}

function TweetButton({ url }: ShareTrayProps): JSX.Element | null {
  const searchParams = new URLSearchParams({
    url,
    text: "Check out this article by @guptasiddhant9",
  });

  const link = `https://twitter.com/intent/tweet?${searchParams.toString()}`;

  return (
    <ExternalLink href={link}>
      <TweetIcon />
      <span className="sr-only">Tweet this article</span>
    </ExternalLink>
  );
}

function LinkedInShareButton({
  url,
  title = "",
}: ShareTrayProps): JSX.Element | null {
  const searchParams = new URLSearchParams({ url, title });
  const link = `https://www.linkedin.com/sharing/share-offsite/?${searchParams.toString()}`;

  return (
    <ExternalLink href={link}>
      <LinkedInIcon />
      <span className="sr-only">Share on LinkedIn</span>
    </ExternalLink>
  );
}

function FacebookShareButton({ url }: ShareTrayProps): JSX.Element | null {
  const searchParams = new URLSearchParams({ u: url });
  const link = `https://www.facebook.com/sharer/sharer.php?${searchParams.toString()}`;

  return (
    <ExternalLink href={link}>
      <FacebookIcon />
      <span className="sr-only">Share on Facebook</span>
    </ExternalLink>
  );
}
