import clsx from "clsx";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./button.module.css";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

/** An anchor tag which looks like a button. */
export function AButton(props: Props) {
  const { href, onClick, className, ...rest } = props;
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href);
    onClick?.(e);
  };

  return (
    <a
      {...rest}
      href={href}
      onClick={handleClick}
      className={clsx(styles.button, className)}
    >
      {props.children}
    </a>
  );
}
