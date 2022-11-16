/* eslint-disable @next/next/no-img-element */
import moment from 'moment';
import type {NextPage} from 'next';
import { Task } from '../types/Task';

type ItemProps = {
    task: Task,
    selectTask(task:Task) :void
}

export const Item : NextPage<ItemProps> = ({task, selectTask}) =>{
    const isTaskFinished = task.finishDate || false;

    const getDateText = (finishDate: Date | undefined, finishPrevisionDate : Date) => {
        if(finishDate){
            return `Concluído em: ${moment(finishDate).format('DD/MM/yyyy')}`;
        }
        return `Conclusão em: ${moment(finishPrevisionDate).format('DD/MM/yyyy')}`;
    }

    return (
        <div className={'container-item' + (isTaskFinished ? '' : ' active')}
            onClick={e => isTaskFinished ? null : selectTask(task)}>
            <img src={isTaskFinished ? 'checked.svg' : 'not-checked.svg'} alt={isTaskFinished ? 'Tarefa em aberto' : 'Tarefa concluída'}/>
            <div>
                <p className={isTaskFinished ? 'finished' : ''}>{task.name}</p>
                <span>{getDateText(task.finishDate, task.finishPrevisionDate)}</span>
            </div>
        </div>
    );
}