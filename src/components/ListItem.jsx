import { useState } from 'react'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { CheckCircle, Pen, Trash2, XCircle } from 'lucide-react'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

const ListItem = ({item, removeTodo, onItemChange}) => {
    const [isMod, setIsMod] = useState(false); //state per cambiare testo in input
    const [newLabel, setNewLabel] = useState(item.label); /* item si trova in List, e fa riferimeto a todo che è uno stato. Per modificarlo devo agire su setTodo */

    const handleLabelSubmit = (e) => {
        e.preventDefault();
        onItemChange && onItemChange({
            ...item, 
            label: newLabel,
        });
        setIsMod(false); //reset
    }

    const reset = () => {
        setNewLabel(item.label);
        setIsMod(false);
    }
    
    return (
        <div key={item.id} className='flex items-center gap-2'>
            <Checkbox 
                disabled={isMod}    
                onCheckedChange={(value) => onItemChange({
                    ...item,
                    checked: value
                })} 
                checked={item.checked} 
                id={item.id} 
            /> {/* onCheckedChange={(value) => onCheck(item.id, value)} ==> il primo value nella parentesi ottengo il valore, il secondo lo passo alla funzione che ho creato sopra */}
            {!isMod && (
                <>
                    <Label htmlFor={item.id}>{item.label}</Label>
                    {!item.checked && <Pen className='size-4 ml-auto cursor-pointer hover:scale-90' onClick={() => setIsMod(!isMod)}/>}
                    <Trash2 className={cn('size-4 ml-2 cursor-pointer text-red-400 hover:text-red-600 hover:scale-90', item.checked && "ml-auto")} onClick={() => removeTodo(item.id)}/> {/* con cn modifico una classe gia assegnata. Utilizzo l'&& per dirgli che quando è checked il cestino si deve spostare a destra. */}
                </>
            )}
            {isMod && (
                <form className='w-full relative' onSubmit={handleLabelSubmit}>
                    <Input onBlur={handleLabelSubmit} autoFocus value={newLabel} onChange={e => setNewLabel(e.target.value)}/>
                    <div className='absolute flex gap-2 right-3 top-1/2 -translate-y-1/2'>
                        <button><CheckCircle className='size-4 text-green-500 hover:text-green-600 cursor-pointer hover:scale-90 '/></button>
                        <XCircle onClick={reset} className='size-4 cursor-pointer text-red-400 hover:text-red-600 hover:scale-90' />
                    </div>
                </form>
                )
            }
            {/* {!isMod ? <Label htmlFor={item.id}>{item.label}</Label> : <Input value={item.label} onChange={e => setNewLabel(e.target.value)}/>} */}
        </div>
    )
}

export default ListItem

/* dentro le graffe posso fare un'espessione js.  */
/* onItemChange lo gestisco come un vero e proprio evento.*/