import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import ImageWithFallback from "./ImageWithFallback";
import { formatDisplayAmount } from "../helpers/utilities";
import { sanitizeImgSrc } from "../helpers/utilities";

interface IProfileCardStyleProps {
  size: number;
  hideBalance?: boolean;
}

const SProfileCard = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const SProfileLogo = styled(ImageWithFallback)<IProfileCardStyleProps>`
  width: ${({ hideBalance, size }) =>
    hideBalance ? `${size / 1.5}px` : `${size}px`};
  height: ${({ hideBalance, size }) =>
    hideBalance ? `${size / 1.5}px` : `${size}px`};
`;

const SProfileName = styled.h2<IProfileCardStyleProps>`
  text-transform: ${({ hideBalance }) =>
    hideBalance ? "uppercase" : "initial"};
  font-size: ${({ hideBalance, size }) =>
    hideBalance ? `${size / 1.875}px` : `${size / 2.5}px`};
  margin: ${({ hideBalance, size }) =>
    hideBalance
      ? `${size / 11.25}px 0px ${size / 11.25}px ${size / 4.5}px`
      : `0 0 ${size / 11.25}px ${size / 4.5}px`};
`;

const SProfileDetails = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SProfileBalance = styled.p<IProfileCardStyleProps>`
  width: 100%;
  line-height: ${({ size }) => `${size / 37.5}`};
  font-size: ${({ size }) => `${size / 3.214}px`};
  padding: 0;
  margin: 0;
  margin-left: ${({ size }) => `${size / 4.5}px`};
`;

const ProfileCard = (props: any) => {
  const { profile, size, totalBalance, nativeCurrency } = props;
  const hideBalance =
    typeof totalBalance === "undefined" &&
    typeof nativeCurrency === "undefined";
  return (
    <SProfileCard>
      <SProfileLogo
        size={size}
        hideBalance={hideBalance}
        src={sanitizeImgSrc(profile.logo)}
        alt="Logo"
      />
      <SProfileDetails>
        <SProfileName size={size} hideBalance={hideBalance}>
          {profile.name || `Business Name`}
        </SProfileName>
        {typeof totalBalance !== "undefined" &&
          typeof nativeCurrency !== "undefined" && (
            <SProfileBalance size={size}>
              {formatDisplayAmount(totalBalance, nativeCurrency)}
            </SProfileBalance>
          )}
      </SProfileDetails>
    </SProfileCard>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
  size: PropTypes.number,
  totalBalance: PropTypes.string,
  nativeCurrency: PropTypes.string
};

ProfileCard.defaultProps = {
  size: 45
};

export default ProfileCard;
