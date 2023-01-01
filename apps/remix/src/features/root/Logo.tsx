import { useRef } from "react";

import { Link, useNavigate } from "@remix-run/react";

import useLongPress from "@gs/hooks/useLongPress";

export default function Logo(): JSX.Element | null {
  const ref = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();
  useLongPress(ref, () => navigate("/admin"));

  return (
    <Link
      to="/"
      className={"select-none overflow-hidden text-ellipsis whitespace-nowrap"}
      translate="no"
      ref={ref}
    >
      <span
        className={
          "hidden text-xl font-black uppercase leading-normal tracking-widest text-primary sm:block"
        }
      >
        Gupta Siddhant
      </span>
      <span
        className={
          "text-3xl font-black uppercase leading-none tracking-widest text-primary sm:hidden"
        }
      >
        GS
      </span>
    </Link>
  );
}
