import React from 'react';

const input = (props) => {
    let inputElement = null;
    switch ( props.elementType ) {
        case ( 'input' ):
            inputElement = <input {...props.elementConfig} id={props.label} className="form-control form-control-lg my-2" value = {props.value} onChange = {props.inputChange} />
            break;
        case ( 'text-area' ):
            inputElement = <textarea {...props.elementConfig} id={props.label} value = {props.value} className="form-control form-control-lg my-2" onChange = {props.inputChange} />
            break;
        default:
            inputElement = <input />
            break;
    }
    return (
        <div className="form-group">
            <label>{props.label}</label>
            {inputElement}
        </div>
    )
}

export default input