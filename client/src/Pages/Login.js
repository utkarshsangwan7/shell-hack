const Login=()=>{

    const handleClick=()=>{
        window.location.href=`${process.env.REACT_APP_SERVER_URL}/api/user/auth/callback`
    }

    return (
        <button onClick={handleClick} >Login</button>
    )
}

export default Login;