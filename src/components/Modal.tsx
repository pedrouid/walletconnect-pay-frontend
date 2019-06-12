import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { SCenterColumn } from "../components/common";
import { colors, transitions } from "../styles";

interface ILightboxStyleProps {
  show: boolean;
  offset: number;
  opacity?: number;
}

const SLightbox = styled.div<ILightboxStyleProps>`
  transition: ${transitions.short.replace("all", "opacity")};
  text-align: center;
  position: absolute;
  width: 100vw;
  height: 100vh;
  margin-left: -50vw;
  top: ${({ offset }) => (offset ? `-${offset}px` : 0)};
  left: 50%;
  z-index: 2;
  will-change: opacity;
  background-color: ${({ opacity }) => {
    let alpha = 0.4;
    if (typeof opacity === "number") {
      alpha = opacity;
    }
    return `rgba(0, 0, 0, ${alpha})`;
  }};
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SModalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface ICloseButtonStyleProps {
  size: number;
  color: string;
  onClick?: any;
}

const SCloseButton = styled.div<ICloseButtonStyleProps>`
  transition: ${transitions.short};
  position: absolute;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  right: ${({ size }) => `${size / 2}px`};
  top: ${({ size }) => `${size / 2}px`};
  opacity: 0.5;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  &:before,
  &:after {
    position: absolute;
    content: " ";
    height: ${({ size }) => `${size}px`};
    width: 2px;
    background: ${({ color }) => `rgb(${colors[color]})`};
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

interface ICardStyleProps {
  maxWidth?: number;
}

const SCard = styled.div<ICardStyleProps>`
  position: relative;
  width: 100%;
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  padding: 30px;
  background-color: rgb(${colors.white});
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SModalContent = styled(SCenterColumn)`
  position: relative;
  word-wrap: break-word;
  padding: 20px;
`;

interface IModalState {
  offset: number;
}

interface IModalProps {
  children: React.ReactNode;
  show: boolean;
  toggleModal?: any;
  maxWidth?: number;
  opacity?: number;
}

const INITIAL_STATE: IModalState = {
  offset: 0
};

class Modal extends React.Component<IModalProps, IModalState> {
  public static propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool.isRequired,
    maxWidth: PropTypes.number,
    toggleModal: PropTypes.func,
    opacity: PropTypes.number
  };

  public static defaultProps = {
    maxWidth: 500
  };

  public lightbox?: HTMLDivElement | null;

  public state: IModalState = {
    ...INITIAL_STATE
  };

  public componentDidUpdate() {
    if (this.lightbox) {
      const lightboxRect = this.lightbox.getBoundingClientRect();
      const offset = lightboxRect.top > 0 ? lightboxRect.top : 0;

      if (offset !== INITIAL_STATE.offset && offset !== this.state.offset) {
        this.setState({ offset });
      }
    }
  }

  public toggleModal = async () => {
    if (this.props.toggleModal) {
      const d = typeof window !== "undefined" ? document : "";
      const body = d ? d.body || d.getElementsByTagName("body")[0] : "";
      if (body) {
        if (this.props.show) {
          body.style.position = "";
        } else {
          body.style.position = "fixed";
        }
      }
      this.props.toggleModal();
    }
  };

  public render() {
    const { offset } = this.state;
    const {
      children,
      show,
      opacity,
      maxWidth,
      toggleModal,
      ...props
    } = this.props;
    return (
      <SLightbox
        show={show}
        offset={offset}
        opacity={opacity}
        ref={c => (this.lightbox = c)}
      >
        <SModalContainer>
          <SHitbox onClick={this.toggleModal} />

          <SCard maxWidth={maxWidth}>
            {toggleModal && (
              <SCloseButton
                size={25}
                color={"dark"}
                onClick={this.toggleModal}
              />
            )}
            <SModalContent {...props}>{children}</SModalContent>
          </SCard>
        </SModalContainer>
      </SLightbox>
    );
  }
}

export default Modal;
