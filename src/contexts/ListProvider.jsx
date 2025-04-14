import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { createContext, useContext, useEffect, useState } from "react";
import { useAxios } from "./AxiosProvider";


const ListContext = createContext({
    lists: undefined,
    createList: undefined,
    handleDelete: undefined, 
    loading: undefined, 
    setSelectedList: undefined,
    selectedList: undefined,
    setListToDelete: undefined,
    initialLoading: undefined,
    initialError: undefined
});

const ListProvider = ({ children }) => {
    const [lists, setLists] = useState([]);
    const [initialLoading, setItitialLoading] = useState(true); //true perchè appena apro app deve apparire lo skeleton per gli elementi che caricano
    const [loading, setLoading] = useState(false);
    const [selectedList, setSelectedList] = useState();
    const [listToDelete, setListToDelete] = useState({
        data: undefined,
        action: undefined,
    })
    const [initialError, setInitialError] = useState();
    const myaxios = useAxios();

    /* vuole due parametri il primo è una funzione e il secondo è un array */
    /* effetto = la funzione, causa = array */
    /* nelle quadre va il valore che se cambia, allora il componente si ricarica */
    /* gli sto dicendo che la fetch si deve caricare solo quando cambio il valore tra le quadre */
    /* fetch e useEffect vanno a braccetto. Quando devo fare una fetch tendo a usare lo useEffect */
    //RECUPERA LISTE AL PRIMO LOADING
    useEffect(() => {
        const getList = async () => {
            setInitialError(undefined);
            try {
                //const result = await myaxios.get('/lists'); result è un'oggetto quindi l'ho destrutturo e uno direttamente data
                const { data } = await myaxios.get('/lists');
                setLists(data);
            } catch (error) {
                setInitialError(error);
            } finally {
                setItitialLoading(false);
            }
        }
        getList();
    },[]) 

    /* createList gestisce sia creazione nuova modal, che modifica di una gia esisitente */
    const createList = (data) => {
        return new Promise(async (res, rej) => {
            setLoading(true); /* prima della fetch true, cosi appena invio la fetch è true */
            console.log(data);

        const listId = data.id || selectedList?.id; //se ho un id, allora è un update, altrimenti è una creazione
        if(listId) {
            //update
            //CTRL+ ù 

            try {
                const result = await myaxios.patch('/lists/' + listId, data);
                setLists(prev => prev.map(item => item.id === result.data.id ? result.data : item));
                res(result.data);
            } catch (error) {
                rej(error);
            } finally {
                setLoading(false);
            }
        } else {
            //create

            try {
                const result = await myaxios.post('/lists', data);
                setLists([...lists, result.data]);
                res(result.data);
            } catch (error) {
                rej(error)
            } finally {
                setLoading(false);
            }
        }
        })
    }

    const handleDelete = (list) => {
        return new Promise(async (res, rej) => {

            try {
                const result = myaxios.delete('/lists/' + list.id);
                setLists(prev => prev.filter(item => item.id !== list.id));
                res(result.data);
            } catch (error) {
                rej(error)
            }
        })
    }

    /* serve per stabilire chi ha accesso al contesto, ovvero i figli => children */
    /* rossi = proprietà, viola = metodi */
    return <ListContext.Provider value={{ 
        lists,
        createList, 
        handleDelete, 
        loading, 
        setSelectedList,
        selectedList,
        setListToDelete,
        initialLoading,
        initialError
        }}> 
        {children}
            <AlertDialog open={!!listToDelete.data} onOpenChange={() => setListToDelete({data: undefined, action: undefined})}> {/* doppia negazione lo fa diventare booleano. */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Questa azione è irriversibile e cancellerà definitivamente la lista e tutti i suoi items.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => listToDelete.action()}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
    </ListContext.Provider>
}

export default ListProvider;

/* shortcut  */
export function useList() {
    return useContext(ListContext);
}