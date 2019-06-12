import * as React from "react";
import styled from "styled-components";
import banner from "../assets/banner.png";

const SBannerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const SBanner = styled.div`
  width: 400px;
  height: 54px;
  background: url(${banner}) no-repeat;
  background-size: contain;
  background-position: center;
`;

const Banner = (props: any) => (
  <SBannerWrapper {...props}>
    <SBanner />
  </SBannerWrapper>
);

export default Banner;
