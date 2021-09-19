import React, { MouseEventHandler } from 'react';
import style from '../styles/globalComponents.module.css';
import * as Icon from 'react-bootstrap-icons';
import { IProduct } from '../types/productTypes';

//#region PopupWindow

type PopupWindowProps = {
    onCloseClick: MouseEventHandler<HTMLButtonElement>,
    title?: string,
    content: React.ReactNode,
}

export function PopupWindow(props: PopupWindowProps) {

    return (
        <div className="PopupWindowBackground" >
            <div className="PopupWindow">
                <button className={style.CloseButton} onClick={props.onCloseClick}><Icon.X size={35} color="red" /></button>
                <main className="content">
                    {props.content}
                </main>
            </div>
        </div>
    )
}

//#endregion 

// #region ClickDropDown
type ClickDropDownProps = {
    clickContent: any,
    dropDownContent: any,

}
export class ClickDropDown extends React.Component {

}



// #endregion ClickDropDown

// #region ProductHorizontalCard
type ProductHorizontalCardProps = {
    product: IProduct,
}
export function ProductHorizontalCard(props: ProductHorizontalCardProps) {

    return (
        <div className="ProductHorziontalCard" >
            <img className="thumbnail" src={props.product.thumbnailImagePath} />
            <div className="content" >
                <h1>{props.product.name}</h1>
                <span className="description">{props.product.description}</span>
            </div>
        </div>
    )
}
// #endregion ProductHorizontalCard

// #region ProductEditCard
type ProductEditCardProps = {
    product: IProduct,
    onDeleteClick: Function,
    onEditClick: Function,
}
export function ProductEditCard(props: ProductEditCardProps) {
    return (
        <div className="ProductHorziontalCard" >
            
            <img className="thumbnail" src={props.product.thumbnailImagePath} />
            <h4>{props.product.name}</h4>
            <div className="content">
                <span className="description">{props.product.description}</span>
                <button className="" onClick={() => { props.onEditClick(props.product.id) }}>Edit</button>
                <button className="" onClick={() => { props.onDeleteClick(props.product.id) }} ><Icon.Trash /></button>
            </div>
        </div>
    )
}
// #endregion ProductEditCard