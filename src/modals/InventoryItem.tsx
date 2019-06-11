import * as React from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import UploadToIpfs from "../components/UploadToIpfs";
import { formatItemId } from "../helpers/utilities";
import { IMenuItem } from "../helpers/types";
import { isNaN } from "../helpers/bignumber";

const SSubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 24px;
`;

interface IInventoryItemState extends IMenuItem {
  description: string;
}

interface IInventoryItemProps {
  menuItem: IMenuItem;
  onAddItem: (menuItem: IMenuItem) => void;
}

class InventoryItem extends React.Component<
  IInventoryItemProps,
  IInventoryItemState
> {
  public state = {
    id: this.props.menuItem ? this.props.menuItem.id : "",
    name: this.props.menuItem ? this.props.menuItem.name : "",
    description: this.props.menuItem
      ? this.props.menuItem.description || ""
      : "",
    price: this.props.menuItem ? this.props.menuItem.price : 0,
    image: this.props.menuItem ? this.props.menuItem.image : ""
  };

  public updateState = (updatedMenuItem: Partial<IMenuItem>) =>
    this.setState({ ...this.state, ...updatedMenuItem });

  public onSubmit = () => {
    const { id, name, description, price, image } = this.state;
    this.props.onAddItem({ id, name, description, price, image });
  };

  public render() {
    return (
      <React.Fragment>
        <h6>{`Add Item`}</h6>
        <UploadToIpfs
          size={200}
          label={`Image`}
          image={this.state.image}
          onUpload={(image: string) => this.updateState({ image })}
        />

        <Input
          type="text"
          label="Name"
          placeholder="Espresso"
          value={this.state.name}
          onChange={(e: any) => {
            const name = e.target.value;
            const id = formatItemId(name);
            this.updateState({ name, id });
          }}
        />

        <Input
          type="text"
          label="Description"
          placeholder="Small cup with 1 shot"
          value={this.state.description}
          onChange={(e: any) =>
            this.updateState({
              description: e.target.value
            })
          }
        />

        <Input
          type="text"
          label="Price"
          placeholder="2.50"
          value={this.state.price}
          onChange={(e: any) => {
            const price = e.target.value;
            if (price && isNaN(price)) {
              return;
            }
            this.updateState({ price });
          }}
        />

        <SSubmitWrapper>
          <Button onClick={this.onSubmit}>{`Submit`}</Button>
        </SSubmitWrapper>
      </React.Fragment>
    );
  }
}

export default InventoryItem;
