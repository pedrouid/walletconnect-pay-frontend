import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import PageWrapper from "../components/PageWrapper";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import { adminUpdateBusinessProfile, adminSubmitSignUp } from "../redux/_admin";
import BUSINESS_TYPES from "../constants/businessTypes";
import COUNTRIES from "../constants/countries";

const SSubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 24px;
`;

interface ISignUpProps {
  adminUpdateBusinessProfile: (updatedBusinessProfile: any) => void;
  adminSubmitSignUp: () => void;
  name: string;
  type: string;
  country: string;
  email: string;
}

class SignUp extends React.Component<any, ISignUpProps> {
  public static propTypes = {
    adminUpdateBusinessProfile: PropTypes.func.isRequired,
    adminSubmitSignUp: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  };

  public render() {
    return (
      <PageWrapper maxWidth={600}>
        <h4>{`Sign Up`}</h4>

        <Input
          type="text"
          label="Business Name"
          placeholder="Crypto Café"
          value={this.props.name}
          disabled={false}
          onChange={(e: any) =>
            this.props.adminUpdateBusinessProfile({ name: e.target.value })
          }
        />

        <Dropdown
          label="Business Type"
          selected={this.props.type}
          options={BUSINESS_TYPES}
          displayKey={"display_type"}
          targetKey={"type"}
          onChange={(type: string) =>
            this.props.adminUpdateBusinessProfile({ type })
          }
        />

        <Input
          type="email"
          label="Email"
          placeholder="contact@cryptocafe.com"
          value={this.props.email}
          disabled={false}
          onChange={(e: any) =>
            this.props.adminUpdateBusinessProfile({ email: e.target.value })
          }
        />

        <Dropdown
          label="Country"
          selected={this.props.country}
          options={COUNTRIES}
          displayKey={"name"}
          targetKey={"code"}
          onChange={(country: string) =>
            this.props.adminUpdateBusinessProfile({ country })
          }
        />
        <SSubmitWrapper>
          <Button onClick={this.props.adminSubmitSignUp}>{`Submit`}</Button>
        </SSubmitWrapper>
      </PageWrapper>
    );
  }
}

const reduxProps = (store: any) => ({
  name: store.admin.businessProfile.name,
  type: store.admin.businessProfile.type,
  country: store.admin.businessProfile.country,
  email: store.admin.businessProfile.email
});

export default connect(
  reduxProps,
  { adminUpdateBusinessProfile, adminSubmitSignUp }
)(SignUp);
