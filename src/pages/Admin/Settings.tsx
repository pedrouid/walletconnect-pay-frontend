import * as React from "react";
import styled from "styled-components";
import {
  getBusinessType,
  getCountryName,
  getIpfsUrl
} from "../../helpers/utilities";
import picture from "../../assets/picture.png";
import { SField, SLabel } from "../../components/common";

const SLogo = styled.div`
  width: 100%;
  & img {
    width: 100%;
    max-width: 150px;
  }
`;

const SProfileWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
`;

const SProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SProfileLeft = styled(SProfileSection)`
  width: 300px;
`;
const SProfileRight = styled(SProfileSection)`
  width: 100%;
`;

const Profile = ({ profile }: any) => (
  <SProfileWrapper>
    <SProfileLeft>
      <SLogo>
        <img
          src={getIpfsUrl(profile.logo)}
          alt={profile.name}
          onError={(event: any) => (event.target.src = picture)}
        />
      </SLogo>
    </SProfileLeft>
    <SProfileRight>
      <h6>{"Business Profile"}</h6>
      <SLabel>{"Name"}</SLabel>
      <SField>{profile.name}</SField>
      <SLabel>{"Description"}</SLabel>
      <SField>{profile.description}</SField>
      <SLabel>{"Type"}</SLabel>
      <SField>{getBusinessType(profile.type)}</SField>
      <SLabel>{"Country"}</SLabel>
      <SField>{getCountryName(profile.country)}</SField>
      <SLabel>{"Email"}</SLabel>
      <SField>{profile.email}</SField>
      <SLabel>{"Phone"}</SLabel>
      <SField>{profile.phone}</SField>
    </SProfileRight>
  </SProfileWrapper>
);

export default Profile;
