import React, { ReactNode } from 'react';
import style from '../../styles/global.module.css';
import * as Icon from 'react-bootstrap-icons';

//type onChangeFunction = (inputName: string, value: string | boolean | number | File[] | File) => void;
type onChangeFunction = Function;
//#region ImageInfoInput
export type ImageInfoInputProps = {
    onChange: onChangeFunction,
    editingEnabled: boolean,
    inputName: string,
    image: File | null,
    imagePath: string,
}
type ImageInfoInputState = {
    uploadedImage: File | null,
    imageUrl: string,
}
export class ImageInfoInput extends React.Component<ImageInfoInputProps, ImageInfoInputState>{
    constructor(props: ImageInfoInputProps) {
        super(props);
        this.state = {
            uploadedImage: this.props.image,
            imageUrl: this.props.imagePath,
        }

        this.onInputChange = this.onInputChange.bind(this);
    }
    onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(this.props.inputName, e.target.files![0]);
        this.setState({
            uploadedImage: e.target.files![0],
            imageUrl: URL.createObjectURL(e.target.files![0]),
        })
    }
    render() {
        var imageUrl = this.state.imageUrl;
        if (this.state.imageUrl == undefined)
            imageUrl = this.props.imagePath;

        var content;
        if (this.props.editingEnabled)
            content = (
                <div className="inputGroup">
                    <img src={imageUrl} className="info" />
                    <input type="file" onChange={this.onInputChange} />
                </div>
                )
        else
            content = <img src={imageUrl} className="info" />
        return (
            <div className="ImageInfoInput">
                {content}
            </div>
        )
    }
}

//#endregion

//#region ImagesInput
export type ImagesInputProps = {
    onChange: onChangeFunction,
    editingEnabled: boolean,
    inputName: string,
    value: File[],
}
type ImagesInputState = {
    items: ImagesInput_ImageItem[],
    newItemIdNum: number,
}
type ImagesInput_ImageItem = {
    id: number,
    file: File,


}
export class ImagesInput extends React.Component<ImagesInputProps, ImagesInputState>{
    constructor(props: ImagesInputProps) {
        super(props);

        let imageItems: ImagesInput_ImageItem[] = [];
        let i = 0;
        if(this.props.value)
        for ( ; i < this.props.value.length; i++) {
            let newItem: ImagesInput_ImageItem = {
                id: i,
                file: this.props.value[i],
            }
            imageItems.push(newItem);
        }
        this.state = {
            items: imageItems,
            newItemIdNum: i,
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    deleteImage(id: number) {
        let itemToDelete = this.state.items.filter((item) => item.id == id)[0];
        let index = this.state.items.indexOf(itemToDelete)
        let newItems = this.state.items.slice();
        newItems.splice(index, 1);

        this.setState({
            items: newItems,
        })

        let imagesToSend: File[] = newItems.map((item) => item.file);
        this.props.onChange(this.props.inputName, imagesToSend);
    }

    onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        let idNum = this.state.newItemIdNum;
        let newItems: ImagesInput_ImageItem[] = [];

        for (var i = 0; i < e.target.files!.length; i++) {
            let newItem: ImagesInput_ImageItem = {
                id: idNum,
                file: e.target.files![i],
            }
            newItems.push(newItem);
            idNum++;
        }
        newItems = newItems.concat(this.state.items);
        this.setState({
            items: newItems,
            newItemIdNum: idNum,
        });

        let filesToReturn: File[] = newItems.map((item) => item.file);
        this.props.onChange(this.props.inputName, filesToReturn);
    }
    render() {
        return (
            <div className="ImagesInput">
                <input type="file" onChange={this.onInputChange} multiple />
            </div>
        )
    }
}

//#endregion ImagesInput
