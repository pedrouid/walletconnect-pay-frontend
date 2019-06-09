import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import ProfileForm from "../../components/ProfileForm";
import Dropdown from "../../components/Dropdown";
import Toggle from "../../components/Toggle";
import Input from "../../components/Input";
import { SField, SLabel, SSeparator } from "../../components/common";
import {
  adminUpdateBusinessProfile,
  adminUpdateBusinessTax,
  adminUpdateBusinessPayment,
  adminSaveBusinessData
} from "../../redux/_admin";
import NATIVE_CURRENCIES from "../../constants/nativeCurrencies";

const SSettingsWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
`;

const SSettingsSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

class Settings extends React.Component<any, any> {
  public static propTypes = {
    businessProfile: PropTypes.object.isRequired,
    businessTax: PropTypes.object.isRequired,
    businessPayment: PropTypes.object.isRequired
  };

  public render() {
    const { businessProfile, businessTax, businessPayment } = this.props;
    return (
      <SSettingsWrapper>
        <SSettingsSection>
          <ProfileForm
            title={`Profile`}
            businessProfile={businessProfile}
            onInputChange={this.props.adminUpdateBusinessProfile}
            onInputSubmit={this.props.adminSaveBusinessData}
          />
        </SSettingsSection>
        <SSettingsSection>
          <h6>{"Tax"}</h6>
          <Input
            type="tel"
            label="Rate"
            placeholder="20"
            value={`${businessTax.rate}`}
            onChange={(e: any) =>
              this.props.adminUpdateBusinessTax({
                rate: e.target.value
              })
            }
            onSubmit={this.props.adminSaveBusinessData}
          />
          <SLabel>{"Included"}</SLabel>
          <Toggle
            color={`lightBlue`}
            active={businessTax.included}
            onClick={() => {
              this.props.adminUpdateBusinessTax({
                included: !businessTax.included
              });
              this.props.adminSaveBusinessData();
            }}
          />
          <SLabel>{"Display"}</SLabel>
          <Toggle
            color={`lightBlue`}
            active={businessTax.display}
            onClick={() => {
              this.props.adminUpdateBusinessTax({
                display: !businessTax.display
              });
              this.props.adminSaveBusinessData();
            }}
          />

          <SSeparator />

          <h6>{"Payment"}</h6>
          <Dropdown
            label="Currency"
            selected={businessPayment.currency}
            options={NATIVE_CURRENCIES}
            displayKey={"currency"}
            targetKey={"currency"}
            onChange={(currency: string) => {
              this.props.adminUpdateBusinessPayment({
                currency
              });
              this.props.adminSaveBusinessData();
            }}
          />
          <Input
            type="text"
            label="ETH Address"
            autoComplete={"off"}
            placeholder="0x0000000000000000000000000000000000000000"
            value={businessPayment.address}
            onChange={(e: any) =>
              this.props.adminUpdateBusinessPayment({
                address: e.target.value
              })
            }
            onSubmit={this.props.adminSaveBusinessData}
          />
          <SLabel>{"Methods"}</SLabel>
          <SField>{businessPayment.methods.toString()}</SField>
        </SSettingsSection>
      </SSettingsWrapper>
    );
  }
}

const reduxProps = (store: any) => ({
  businessProfile: store.admin.businessProfile,
  businessTax: store.admin.businessTax,
  businessPayment: store.admin.businessPayment
});

export default connect(
  reduxProps,
  {
    adminUpdateBusinessProfile,
    adminUpdateBusinessTax,
    adminUpdateBusinessPayment,
    adminSaveBusinessData
  }
)(Settings);
