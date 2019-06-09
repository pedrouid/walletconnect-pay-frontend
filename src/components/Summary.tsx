import * as React from "react";

import { SColumnRowTitle, SColumnRow } from "../components/common";
import { formatDisplayAmount } from "../helpers/utilities";

const Summary = (props: any) => {
  const { checkout, businessTax, businessPayment } = props;
  return (
    <React.Fragment>
      <SColumnRow>
        <SColumnRowTitle>{`Summary`}</SColumnRowTitle>
      </SColumnRow>
      {businessTax.display ? (
        <React.Fragment>
          <SColumnRow>
            <div>{`Sub Total`}</div>
            <div>
              {formatDisplayAmount(checkout.subtotal, businessPayment.currency)}
            </div>
          </SColumnRow>
          <SColumnRow>
            <div>{`Tax`}</div>
            <div>
              {formatDisplayAmount(checkout.tax, businessPayment.currency)}
            </div>
          </SColumnRow>
          <SColumnRow>
            <div>{`Net Total`}</div>
            <div>
              {formatDisplayAmount(checkout.nettotal, businessPayment.currency)}
            </div>
          </SColumnRow>
        </React.Fragment>
      ) : (
        <SColumnRow>
          <div>{`Total`}</div>
          <div>
            {formatDisplayAmount(checkout.rawtotal, businessPayment.currency)}
          </div>
        </SColumnRow>
      )}
    </React.Fragment>
  );
};

export default Summary;
