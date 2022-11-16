/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useState } from 'react';
import { executeRequest } from '../services/api';

type LoginProps = {
    setAccessToken(s:string) : void
}

export const Login : NextPage<LoginProps> = ({setAccessToken}) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [emailRegister, setEmailRegister] = useState('');
    const [nameRegister, setNameRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [confirmPasswordRegister, setConfirmPasswordRegister] = useState('');
    const [errorRegister, setErrorRegister] = useState('');
    const [loadingRegister, setLoadingRegister] = useState(false);

    const doLogin = async() => {
        try{
            if(!email || !password){
                return setError('Preencher os campos.');
            }

            setLoading(true);

            const body = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
                localStorage.setItem('accessToken', result.data.token);
                localStorage.setItem('name', result.data.name);
                localStorage.setItem('email', result.data.email);
                setAccessToken(result.data.token);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar login:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao efetuar login, tente novamente.');
            }
        }

        setLoading(false);
    }

    const doRegister = async() => {
        try{
            if(!emailRegister || !passwordRegister || !nameRegister || !confirmPasswordRegister){
                return setErrorRegister('Favor preencher os campos.');
            } else if(confirmPasswordRegister != passwordRegister) {
                return setErrorRegister('As senhas não coincidem.');
            }

            setLoadingRegister(true);

            const body = {
                name: nameRegister,
                email: emailRegister,
                password: passwordRegister
            };

            const result = await executeRequest('user', 'POST', body);
            if(result && result.data){
               
                const body = {
                    login: emailRegister,
                    password: passwordRegister
                };
    
                const result = await executeRequest('login', 'POST', body);
                if(result && result.data){
                   localStorage.setItem('accessToken', result.data.token);
                   localStorage.setItem('name', result.data.name);
                   localStorage.setItem('email', result.data.email);
                   setAccessToken(result.data.token);
                }
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar o cadastro:', e);
            if(e?.response?.data?.error){
                setErrorRegister(e?.response?.data?.error);
            }else{
                setErrorRegister('Ocorreu erro ao efetuar o cadastro, tente novamente.');
            }
        }

        setLoadingRegister(false);
    }

    return (
        <>        
            <div className='container-login'>            
                <img src='/logo.svg' alt='Logo Fiap' className='logo'/>
                <div className="form">
                    {!isRegister ? 
                        <div className='form-login'>
                            {error && <p>{error}</p>}
                            <div>
                                <img src='/mail.svg' alt='Login'/> 
                                <input type="text" placeholder="Login" 
                                    value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/lock.svg' alt='Senha'/> 
                                <input type="password" placeholder="Senha" 
                                    value={password} onChange={e => setPassword(e.target.value)}/>
                            </div>
                            <button type='button' onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                            <div className='divider'>
                                <hr className="solid"/>
                                <span>OU</span>
                                <hr className="solid"/>
                            </div>
                            <button className='button-cadastrar' type='button' onClick={_ => setIsRegister(true)}>Cadastrar</button>
                        </div>                                
                        : 
                        <div>
                            {errorRegister && <p>{errorRegister}</p>}
                            <div>
                                <img src='/user.svg' alt='Nome'/> 
                                <input type="text" placeholder="Nome" 
                                    value={nameRegister} onChange={e => setNameRegister(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/mail.svg' alt='Email'/> 
                                <input type="text" placeholder="E-mail" 
                                    value={emailRegister} onChange={e => setEmailRegister(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/lock.svg' alt='Senha'/> 
                                <input type="password" placeholder="Senha" 
                                    value={passwordRegister} onChange={e => setPasswordRegister(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/lock.svg' alt='Confirmar Senha'/> 
                                <input type="password" placeholder="Confirmar Senha" 
                                    value={confirmPasswordRegister} onChange={e => setConfirmPasswordRegister(e.target.value)}/>
                            </div>
                            <button type='button' onClick={doRegister} disabled={loadingRegister}>{loadingRegister ? '...Carregando' : 'Cadastrar'}</button>
                            <button className='button-cancelar' type='button' onClick={_ => setIsRegister(false)}>Cancelar</button>
                        </div>
                    }           
                </div>       
            </div>        
        </>
    );

}