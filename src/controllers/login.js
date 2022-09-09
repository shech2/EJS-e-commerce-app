const loginController = require('../services/login');

function login(req,res){
    console.log('cookies: ')
    console.log( req.cookies)
    const result = loginService.login(req.body.username, req.body.password)

   
    result.then((r) => {
        console.log(r)
        if(r){
            res.cookie('foo', 'bar')
            res.send('Login Successfully!')
        }
        else{
            res.send('Login Failed!')
        }
    })
}

function register(req,res){
    const result = loginService.register(req.body.username,req.body.email, req.body.password)

    result.then((r) => {
        console.log(r)
        if(r){
            res.send('Register Successfully!')
        }
        else{
            res.send('Register Failed!')
        }
    })
}


module.exports = {login,register}