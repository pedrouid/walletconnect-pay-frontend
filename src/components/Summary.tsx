import * as React from "react";

import { SColumnRowTitle, SColumnRow } from "../components/common";
import { formatDisplayAmount } from "../helpers/utilities";

const Summary = (props: any) => {
  const { checkout, businessData } = props;
  return (
    <React.Fragment>
      <SColumnRow>
        <SColumnRowTitle>{`Summary`}</SColumnRowTitle>
      </SColumnRow>
      {businessData.taxDisplay ? (
        <React.Fragment>
          <SColumnRow>
            <div>{`Sub Total`}</div>
            <div>
              {formatDisplayAmount(
                checkout.subtotal,
                businessData.currencySymbol
              )}
            </div>
          </SColumnRow>
          <SColumnRow>
            <div>{`Tax`}</div>
            <div>
              {formatDisplayAmount(checkout.tax, businessData.currencySymbol)}
            </div>
          </SColumnRow>
          <SColumnRow>
            <div>{`Net Total`}</div>
            <div>
              {formatDisplayAmount(
                checkout.nettotal,
                businessData.currencySymbol
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
              businessData.currencySymbol
            )}
          </div>
        </SColumnRow>
      )}
    </React.Fragment>
  );
};

export default Summary;
