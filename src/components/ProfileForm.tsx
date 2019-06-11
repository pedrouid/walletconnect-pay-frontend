import * as React from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import UploadToIpfs from "../components/UploadToIpfs";
import { IProfile } from "../helpers/types";
import BUSINESS_TYPES from "../constants/businessTypes";
import COUNTRIES from "../constants/countries";

const SSubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 24px;
`;

interface IProfileFormProps {
  title?: string;
  noLogo?: boolean;
  profile: IProfile;
  onInputChange: (input: any) => void;
  onInputSubmit?: () => void;
  onSubmit?: () => void;
}

const ProfileForm = (props: IProfileFormProps) => {
  const {
    title,
    noLogo,
    profile,
    onInputChange,
    onInputSubmit,
    onSubmit
  } = props;
  return (
    <React.Fragment>
      {title && <h6>{title}</h6>}

      {!noLogo && (
        <UploadToIpfs
          size={200}
          label={`Logo`}
          image={profile.logo}
          onUpload={(logo: string) => {
            onInputChange({ logo });
            if (onInputSubmit) {
              onInputSubmit();
            }
          }}
        />
      )}

      <Input
        type="text"
        label="Name"
        placeholder="Crypto Café"
        value={profile.name}
        onChange={(e: any) => onInputChange({ name: e.target.value })}
        onSubmit={() => {
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />

      <Input
        type="text"
        label="Description"
        placeholder="Boutique Coffeeshop for Crypto Folks"
        value={profile.description}
        onChange={(e: any) =>
          onInputChange({
            description: e.target.value
          })
        }
        onSubmit={() => {
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />

      <Dropdown
        label="Type"
        selected={profile.type}
        options={BUSINESS_TYPES}
        displayKey={"display_name"}
        targetKey={"type"}
        onChange={(type: string) => {
          onInputChange({ type });
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />

      <Input
        type="email"
        label="Email"
        placeholder="contact@cryptocafe.com"
        value={profile.email}
        onChange={(e: any) => onInputChange({ email: e.target.value })}
        onSubmit={() => {
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />

      <Dropdown
        label="Country"
        selected={profile.country}
        options={COUNTRIES}
        displayKey={"name"}
        targetKey={"code"}
        onChange={(country: string) => {
          onInputChange({ country });
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />

      <Input
        type="text"
        label="Phone"
        placeholder="+49 03054908166"
        value={profile.phone}
        onChange={(e: any) => onInputChange({ phone: e.target.value })}
        onSubmit={() => {
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />

      {onSubmit && (
        <SSubmitWrapper>
          <Button onClick={onSubmit}>{`Submit`}</Button>
        </SSubmitWrapper>
      )}
    </React.Fragment>
  );
};

export default ProfileForm;
