import * as React from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import UploadToIpfs from "../components/UploadToIpfs";
import { IMenuItem } from "../helpers/types";
import { isNaN } from "../helpers/bignumber";
import { uuid } from "../helpers/utilities";

const SSubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 24px;
  & > button:last-child {
    margin-left: 16px;
  }
  & > button:first-child {
    margin-left: 0;
  }
`;

interface IInventoryItemProps {
  menuItem: IMenuItem;
  onAddItem: (menuItem: IMenuItem) => void;
  onRemoveItem: (menuItem: IMenuItem) => void;
}

class InventoryItem extends React.Component<IInventoryItemProps, IMenuItem> {
  public state = {
    id: this.props.menuItem ? this.props.menuItem.id : "",
    name: this.props.menuItem ? this.props.menuItem.name : "",
    description: this.props.menuItem ? this.props.menuItem.description : "",
    price: this.props.menuItem ? this.props.menuItem.price : 0,
    image: this.props.menuItem ? this.props.menuItem.image : ""
  };

  public updateState = (updatedMenuItem: Partial<IMenuItem>) =>
    this.setState({ ...this.state, ...updatedMenuItem });

  public onSubmit = () => {
    let { id } = this.state;
    const { name, description, price, image } = this.state;
    if (!id.trim()) {
      id = uuid();
    }
    this.props.onAddItem({ id, name, description, price, image });
  };

  public onRemove = () => {
    const { id, name, description, price, image } = this.state;
    this.props.onRemoveItem({ id, name, description, price, image });
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
          onChange={(e: any) => this.updateState({ name: e.target.value })}
        />

        <Input
          type="text"
          label="Description"
          placeholder="Small cup with 1 shot"
          value={this.state.description}
          onChange={(e: any) =>
            this.updateState({ description: e.target.value })
          }
        />

        <Input
          type="text"
          label="Price"
          placeholder="2.50"
          value={`${this.state.price}`}
          onChange={(e: any) => {
            const price = e.target.value;
            if (price && isNaN(price)) {
              return;
            }
            this.updateState({ price });
          }}
        />

        <SSubmitWrapper>
          {this.props.menuItem ? (
            <React.Fragment>
              <Button color={`red`} onClick={this.onRemove}>{`Delete`}</Button>
              <Button onClick={this.onSubmit}>{`Update`}</Button>
            </React.Fragment>
          ) : (
            <Button onClick={this.onSubmit}>{`Submit`}</Button>
          )}
        </SSubmitWrapper>
      </React.Fragment>
    );
  }
}

export default InventoryItem;
