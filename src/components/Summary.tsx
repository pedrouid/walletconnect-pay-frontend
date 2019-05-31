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
      {businessData.tax.display ? (
        <React.Fragment>
          <SColumnRow>
            <div>{`Sub Total`}</div>
            <div>
              {formatDisplayAmount(
                checkout.subtotal,
                businessData.payment.currency
              )}
            </div>
          </SColumnRow>
          <SColumnRow>
            <div>{`Tax`}</div>
            <div>
              {formatDisplayAmount(checkout.tax, businessData.payment.currency)}
            </div>
          </SColumnRow>
          <SColumnRow>
            <div>{`Net Total`}</div>
            <div>
              {formatDisplayAmount(
                checkout.nettotal,
                businessData.payment.currency
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
              businessData.payment.currency
            )}
          </div>
        </SColumnRow>
      )}
    </React.Fragment>
  );
};

export default Summary;
