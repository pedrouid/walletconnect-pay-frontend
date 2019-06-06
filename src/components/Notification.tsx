import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { colors, shadows, responsive, transitions } from "../styles";

interface INotificationStyleProps {
  error: boolean;
  show: boolean;
}

const SNotification = styled.div<INotificationStyleProps>`
  position: fixed;
  z-index: 20;
  width: calc(100% - 20px);
  max-width: 400px;
  top: 0;
  right: 0;
  margin: 10px;
  text-align: center;
  padding: 15px 20px;
  border-radius: 6px;
  text-align: center;
  transition: ${transitions.base};
  background: rgb(${colors.white});
  color: ${({ error }) =>
    error ? `rgb(${colors.red})` : `rgb(${colors.dark})`};
  box-shadow: ${shadows.medium};
  transform: ${({ show }) =>
    show ? "translate3d(0, 0, 0)" : "translate3d(0, -1000px, 0);"};

  @media screen and (${responsive.sm.max}) {
    top: auto;
    left: 0;
    bottom: 0;
    margin: 0 auto;
    transform: ${({ show }) =>
      show ? "translate3d(0, 0, 0)" : "translate3d(0, 1000px, 0);"};
  }
`;

interface INotificationProps extends INotificationStyleProps {
  message: string;
}

const Notification = (props: INotificationProps) => (
  <SNotification show={props.show} error={props.error}>
    {props.message}
  </SNotification>
);

const reduxProps = (store: any) => ({
  error: store.notification.error,
  show: store.notification.show,
  message: store.notification.message
});

export default connect(
  reduxProps,
  null
)(Notification);
