import { IProduct } from "../../types/productTypes";
import * as Icon from 'react-bootstrap-icons';



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
                <span className="price">{props.product.price}</span>
                <span className="description">{props.product.description}</span>
                <button className="" onClick={() => { props.onEditClick(props.product.id) }}>Edit</button>
                <button className="" onClick={() => { props.onDeleteClick(props.product.id) }} ><Icon.Trash /></button>
            </div>
        </div>
    )
}


