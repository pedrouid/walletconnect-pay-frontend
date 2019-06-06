import * as React from "react";
import styled from "styled-components";

import { colors, shadows } from "../styles";

interface ICardStyleProps {
  spanHeight?: boolean;
  spanWidth?: boolean;
  maxWidth: number;
  background: string;
  margin?: number;
  shadow?: boolean;
}

interface ICardProps extends ICardStyleProps {
  children: React.ReactNode;
}

const SCard = styled.div<ICardStyleProps>`
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? "100%" : "auto")};
  max-width: ${({ maxWidth, spanWidth }) =>
    !spanWidth ? `${maxWidth}px` : "auto"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ background }) => `rgb(${colors[background]})`};
  color: rgb(${colors.dark});
  margin: ${({ margin }) => (margin ? `${margin}px` : "0")};
  box-shadow: ${({ shadow }) => (shadow ? `${shadows.soft}` : "none")};
  border-radius: 6px;
  padding: 20px;
`;

const Card = (props: ICardProps) => {
  return (
    <SCard
      spanHeight={props.spanHeight}
      spanWidth={props.spanWidth}
      maxWidth={props.maxWidth}
      shadow={props.shadow}
      {...props}
    >
      {props.children}
    </SCard>
  );
};

Card.defaultProps = {
  maxWidth: 600,
  background: "white"
};

export default Card;
