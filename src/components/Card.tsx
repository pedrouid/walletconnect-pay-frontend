import * as React from "react";
import styled from "styled-components";

import { colors, shadows } from "../styles";

interface ICardStyleProps {
  maxWidth: number;
  margin?: number;
  shadow?: boolean;
}

interface ICardProps extends ICardStyleProps {
  children: React.ReactNode;
}

const SCard = styled.div<ICardStyleProps>`
  width: 100%;
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(${colors.white});
  color: rgb(${colors.dark});
  margin: ${({ margin }) => (margin ? `${margin}px` : "0")};
  box-shadow: ${({ shadow }) => (shadow ? `${shadows.soft}` : "none")};
  border-radius: 6px;
  padding: 20px;
`;

const Card = (props: ICardProps) => {
  return (
    <SCard maxWidth={props.maxWidth} shadow={props.shadow} {...props}>
      {props.children}
    </SCard>
  );
};

Card.defaultProps = {
  maxWidth: 600
};

export default Card;
