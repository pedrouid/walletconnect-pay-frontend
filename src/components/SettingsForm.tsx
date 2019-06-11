import * as React from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Toggle from "../components/Toggle";
import { ISettings } from "../helpers/types";
import { SLabel, SSeparator } from "../components/common";
import NATIVE_CURRENCIES from "../constants/nativeCurrencies";
import MultipleChoice from "../components/MultipleChoice";
import PAYMENT_METHODS from "../constants/paymentMethods";
import { IPaymentMethod } from "../helpers/types";
import { capitalize } from "../helpers/utilities";

const SSubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 24px;
`;

interface ISettingsFormProps {
  settings: ISettings;
  onInputChange: (input: any) => void;
  onInputSubmit?: () => void;
  onSubmit?: () => void;
  onNotification?: (message: string, error?: boolean) => void;
}

const SettingsForm = (props: ISettingsFormProps) => {
  const {
    settings,
    onInputChange,
    onInputSubmit,
    onSubmit,
    onNotification
  } = props;
  return (
    <React.Fragment>
      <h6>{"Tax"}</h6>
      <Input
        type="tel"
        label="Rate"
        placeholder="20"
        value={`${settings.taxRate}`}
        onChange={(e: any) =>
          onInputChange({
            taxRate: e.target.value
          })
        }
        onSubmit={() => {
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />
      <SLabel>{"Included"}</SLabel>
      <Toggle
        color={`lightBlue`}
        active={settings.taxIncluded}
        onClick={() => {
          onInputChange({
            taxIncluded: !settings.taxIncluded
          });
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />
      <SLabel>{"Display"}</SLabel>
      <Toggle
        active={settings.taxDisplay}
        onClick={() => {
          onInputChange({
            taxDisplay: !settings.taxDisplay
          });
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />

      <SSeparator />

      <h6>{"Payment"}</h6>
      <Dropdown
        label="Currency"
        selected={settings.paymentCurrency}
        options={NATIVE_CURRENCIES}
        displayKey={"currency"}
        targetKey={"currency"}
        onChange={(paymentCurrency: string) => {
          onInputChange({
            paymentCurrency
          });
          if (onInputSubmit) {
            onInputSubmit();
          }
        }}
      />
      <Input
        type="text"
        label="ETH Address"
        autoComplete={"off"}
        placeholder="0x0000000000000000000000000000000000000000"
        value={settings.paymentAddress}
        onChange={(e: any) =>
          onInputChange({
            paymentAddress: e.target.value
          })
        }
        onSubmit={onInputSubmit}
      />
      <SLabel>{"Methods"}</SLabel>
      <MultipleChoice
        choices={PAYMENT_METHODS}
        selected={
          settings && settings.paymentMethods ? settings.paymentMethods : []
        }
        renderItem={(method: IPaymentMethod) => (
          <React.Fragment>
            {`${capitalize(method.type)} (${method.assetSymbol})`}
          </React.Fragment>
        )}
        requiredKeys={["type", "assetSymbol"]}
        onChange={paymentMethods => {
          if (paymentMethods && paymentMethods.length) {
            onInputChange({
              paymentMethods
            });
            if (onInputSubmit) {
              onInputSubmit();
            }
          } else {
            if (onNotification) {
              onNotification(
                "Required to accept at least one payment method",
                true
              );
            }
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

export default SettingsForm;
