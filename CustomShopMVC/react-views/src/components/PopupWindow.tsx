import React, { MouseEventHandler } from 'react';
import style from '../styles/globalComponents.module.css';
import * as Icon from 'react-bootstrap-icons';



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


