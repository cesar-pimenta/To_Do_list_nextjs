/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Filter } from '../components/Filter';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { List } from '../components/List';
import { executeRequest } from '../services/api';

type PrincipalProps = {
    setAccessToken(s:string) : void
}

export const Principal : NextPage<PrincipalProps> = ({setAccessToken}) =>{

    // LISTA & FILTER
    const [list, setList] = useState([]);
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState(0);

    // FORM
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [previsionDate, setPrevisionDate] = useState('');

    const sair = () =>{
        localStorage.clear();
        setAccessToken('');
    }

    const getFilteredList = async() => {
        try{
            let filters = '?status='+status;

            if(previsionDateStart){
                filters+= '&finishPrevisionStart='+previsionDateStart;
            }

            if(previsionDateEnd){
                filters+= '&finishPrevisionEnd='+previsionDateEnd;
            }
            
            const result = await executeRequest('task'+filters, 'GET');
            if(result && result.data){
               setList(result.data);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao buscar tarefas:', e);
        }
    }

    useEffect(() => {
        getFilteredList();
    }, [previsionDateStart, previsionDateEnd, status]);

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setError('');
        setName('');
        setPrevisionDate('');
    }

    const insertTask = async() => {
        try{
            if(!name || !previsionDate){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                name,
                finishPrevisionDate:previsionDate
            };

            await executeRequest('task', 'POST', body);
            await getFilteredList();
            closeModal();
        }catch(e : any){
            console.log('Ocorreu erro ao cadastrar tarefa:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao cadastrar tarefa, tente novamente.');
            }
        }

        setLoading(false);
    }

    return (
        <>
            <Header sair={sair} showModal={() => setShowModal(true)}/>
            <Filter 
                previsionDateStart={previsionDateStart}
                previsionDateEnd={previsionDateEnd}
                status={status}
                setPrevisionDateStart={setPrevisionDateStart}
                setPrevisionDateEnd={setPrevisionDateEnd}
                setStatus={setStatus}
            />
            <List list={list} getFilteredList={getFilteredList}/>
            <Footer showModal={() => setShowModal(true)}/>
            <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                        <p>Adicionar uma tarefa</p>
                        {error && <p className='error'>{error}</p>}
                        <input type="text" placeholder='Nome da tarefa'
                            value={name} onChange={e => setName(e.target.value)}/>
                        <input type="date" placeholder='Data de previsão da tarefa'
                            value={previsionDate} onChange={e => setPrevisionDate(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <div className='button col-12'>
                        <button
                            disabled={loading}
                            onClick={insertTask}
                        >   {loading? "..Carregando" : "Salvar"}</button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}