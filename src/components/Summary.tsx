import * as React from "react";

import { SColumnRowTitle, SColumnRow } from "../components/common";
import { formatDisplayAmount } from "../helpers/utilities";

const Summary = (props: any) => {
  const { checkout, settings } = props;
  return (
    <React.Fragment>
      <SColumnRow>
        <SColumnRowTitle>{`Summary`}</SColumnRowTitle>
      </SColumnRow>
      {settings.taxDisplay ? (
        <React.Fragment>
          <SColumnRow>
            <div>{`Sub Total`}</div>
            <div>
              {formatDisplayAmount(
                checkout.subtotal,
                settings.paymentCurrency
              )}
            </div>
          </SColumnRow>
          <SColumnRow>
            <div>{`Tax`}</div>
            <div>
              {formatDisplayAmount(
                checkout.tax,
                settings.paymentCurrency
              )}
            </div>
          </SColumnRow>
          <SColumnRow>
            <div>{`Net Total`}</div>
            <div>
              {formatDisplayAmount(
                checkout.nettotal,
                settings.paymentCurrency
              )}
            </div>
          </SColumnRow>
        </React.Fragment>
      ) : (
        <SColumnRow>
          <div>{`Total`}</div>
          <div>
            {formatDisplayAmount(
              checkout.rawtotal,
              settings.paymentCurrency
            )}
          </div>
        </SColumnRow>
      )}
    </React.Fragment>
  );
};

export default Summary;
