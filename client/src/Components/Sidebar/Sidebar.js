import React from 'react';
import { Select,InputLabel,MenuItem,Button} from '@mui/material';
import './Sidebar.css';

const Sidebar = ({language,theme,setLanguage,setTheme,RoomID})=>{
    const handleChangeLanguage = (e)=>{
        console.log(e.target.value);
        setLanguage(e.target.value);
    }
    const handleChangeTheme = (e)=>{
        console.log(e.target.value);
        setTheme(e.target.value);
    }
    return(
        <div className='language-theme-option'>
                <div>
                    <InputLabel id="demo-simple-select-label">Language</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={language}
                        label="Language"
                        onChange={handleChangeLanguage}
                        className='select-option'
                    >
                        <MenuItem value={'c'}>C</MenuItem>
                        <MenuItem value={'c++'}>C++</MenuItem>
                        <MenuItem value={'java'}>Java</MenuItem>
                        <MenuItem value={'python'}>Python</MenuItem>
                        <MenuItem value={'javascript'}>JavaScript</MenuItem>
                    </Select>
                </div>
                <div>
                    <InputLabel id="demo-simple-select-label">Theme</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={theme}
                        label="Theme"
                        onChange={handleChangeTheme}
                        className='select-option'
                    >
                        <MenuItem value={'github'}>light</MenuItem>
                        <MenuItem value={'monokai'}>dark</MenuItem>
                    </Select>
                </div>
                <div>
                    <Button variant="outlined" onClick={() => {navigator.clipboard.writeText(`${process.env.REACT_APP_SERVER_URL}/join-room/${RoomID}`)}}>Invite Collaborators</Button>
                </div>
        </div>
    );
}

export default Sidebar;