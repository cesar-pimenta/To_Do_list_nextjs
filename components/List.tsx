/* eslint-disable @next/next/no-img-element */
import moment from 'moment';
import type {NextPage} from 'next';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { executeRequest } from '../services/api';
import { Task } from '../types/Task';
import { Item } from './Item';

type ListProps = {
    list: Array<any>,
    getFilteredList() : void
}

export const List : NextPage<ListProps> = ({list, getFilteredList}) =>{

    // FORM
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [_id, setId] = useState('');
    const [name, setName] = useState('');
    const [previsionDate, setPrevisionDate] = useState('');
    const [finishDate, setFinishDate] = useState('');

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setError('');
        setName('');
        setPrevisionDate('');
    }

    const selectTask = (task:Task) => {
        setShowModal(true);
        setName(task.name);
        setId(task._id || '');
        setPrevisionDate(moment(task.finishPrevisionDate).format('yyyy-MM-DD'));
    }

    const updateTask = async() => {
        try{
            if(!_id || !name || !previsionDate){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                name,
                finishPrevisionDate:previsionDate
            } as any;

            if(finishDate){
                body.finishDate = finishDate;
            }

            await executeRequest('task?id='+_id, 'PUT', body);
            await getFilteredList();
            closeModal();
        }catch(e : any){
            console.log('Ocorreu erro ao alterar tarefa:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao alterar tarefa, tente novamente.');
            }
        }

        setLoading(false);
    }

    const deleteTask = async() => {
        try{
            if(!_id){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            await executeRequest('task?id='+_id, 'DELETE');
            await getFilteredList();
            closeModal();
        }catch(e : any){
            console.log('Ocorreu erro ao excluir tarefa:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao excluir tarefa, tente novamente.');
            }
        }

        setLoading(false);
    }

    return (
        <>
        <div className={'container-list' + (list && list.length > 0 ? ' not-empty' : '')}>
            {
                list && list.length > 0 
                ? list.map(i => <Item key={i._id} task={i} selectTask={selectTask}/>) 
                :
                    <>
                        <img src="/empty.svg" alt='Nenhum registro encontrado'/>
                        <p>Você ainda não possui tarefas cadastradas!</p>
                    </>
            }
        </div>
        
        <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                        <p>Alterar tarefa</p>
                        {error && <p className='error'>{error}</p>}
                        <input type="text" placeholder='Nome da tarefa'
                            value={name} onChange={e => setName(e.target.value)}/>
                        <input type="date" placeholder='Data de previsão da tarefa'
                            value={previsionDate} onChange={e => setPrevisionDate(e.target.value)}/>
                        <input type="date" placeholder='Data de conclusão'
                            value={finishDate} onChange={e => setFinishDate(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <div className='button col-12'>
                        <button
                            disabled={loading}
                            onClick={updateTask}
                        >   {loading? "..Carregando" : "Atualizar"}</button>
                        <span onClick={deleteTask}>Excluir tarefa</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
        
    );
}