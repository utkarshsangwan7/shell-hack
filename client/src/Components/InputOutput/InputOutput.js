import React from 'react';
import { TextareaAutosize } from '@mui/material';
import './InputOutput.css';

const InputOuput = ({Input,Output,setInput,setOutput})=>{
    const handleChangeInput = (e)=>{
        setInput(e.target.value);
        console.log(e.target.value);
    }   
    const handleChangeOuput = (e)=>{
        setOutput(e.target.value);
        console.log(e.target.value);
    }
    return(
        <div className='input-output-wrapper'>
            <TextareaAutosize
                aria-label="Input"
                minRows={3}
                placeholder="Input"
                value={Input}
                onChange={handleChangeInput}
            />
            <TextareaAutosize
                aria-label="Output"
                minRows={3}
                placeholder="Output"
                value={Output}
                onChange={handleChangeOuput}
            />
        </div>
    );
}

export default InputOuput;