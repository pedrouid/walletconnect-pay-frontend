import * as React from "react";
import styled from "styled-components";
import Toggle from "./Toggle";
import Button from "./Button";
import { colors } from "../styles";

const SButton = styled(Button)`
  color: rgb(${colors.dark});
  text-align: left !important;
`;

const SAbsolute = styled.div`
  height: 100%;
  top: 0;
  bottom: 0;
  right: 16px;
  position: absolute;
  display: flex;
  align-items: center;
`;

const SToggle = styled(Toggle)`
  & div {
    width: 26px;
    height: 26px;
  }
  & div:after {
    display: none;
  }
`;

interface IMultipleChoiceProps {
  choices: any[];
  selected: any[];
  requiredKeys: string[];
  renderItem: (item: any) => any;
  onChange: (selected: any[]) => void;
}

function isMatch(item: any, x: any, keys: string[]) {
  let match = false;
  const matches = keys.filter((key: string) => x[key] === item[key]);
  if (matches && matches.length === keys.length) {
    match = true;
  }
  return match;
}

function isActive(item: any, selected: any[], keys: string[]): boolean {
  let active = false;
  const matches = selected.filter(x => isMatch(item, x, keys));
  if (matches && matches.length) {
    active = true;
  }
  return active;
}

function updateSelected(
  active: boolean,
  item: any,
  selected: any[],
  keys: any[]
): any[] {
  let newSelected = [...selected];
  if (active) {
    newSelected = selected.filter((x: any) => !isMatch(item, x, keys));
  } else {
    newSelected = [...selected, item];
  }
  return newSelected;
}

const MultipleChoice = (props: IMultipleChoiceProps) => {
  const { choices, selected, renderItem, requiredKeys, onChange } = props;
  return (
    <React.Fragment>
      {choices.map((item: any, idx: number) => {
        const active = isActive(item, selected, requiredKeys);
        return (
          <SButton
            color="white"
            marginTop={12}
            key={`multiple-choice-${idx}`}
            onClick={() =>
              onChange(updateSelected(active, item, selected, requiredKeys))
            }
          >
            <React.Fragment>{renderItem(item)}</React.Fragment>
            <SAbsolute>
              <SToggle active={active} />
            </SAbsolute>
          </SButton>
        );
      })}
    </React.Fragment>
  );
};

export default MultipleChoice;
