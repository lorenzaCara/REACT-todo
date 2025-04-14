import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAxios } from "./AxiosProvider";

const ItemContext = createContext();

const ItemProvider = ({children}) => {
    const [_items, setItems] = useState([]);
    const myaxios = useAxios();

    /* funzione che mi tira fuori quelle gia filtrate. Queste sono quelle che esporto */
    const items = (id) => {
        /* Filtra gli oggetti in _items in base al valore di list_id */
        return _items.filter(item => item.list_id === +id);
    }

    /* uso la function (MANUALE) al posto dello useEffect (AUTOMATICO) perchè voglio che il caricamento degli oggetti sia attivato solo quando il componente (o l'utente) lo richiede. NON AUTOMATICAMENTE.*/
    async function getListItems(id) {
        
        try {
            const { data: items } = await myaxios.get('/items?list_id=' + id);
            console.log(items);
            
            setItems(prev => [
                ...prev.filter(item => !items.find(i => i.id === item.id)),
                ...items
            ])
        } catch (error) {
            toast.error('Impossibile caricare gli items', {
                description: 'Riprova più tardi',
                classNames: {
                    icon: 'text-red-500',
                    title: 'text-red-500',
                }
            })
        }
    }

    function upsertItem(item) {
        console.log(item);
        
        //promise per gestire problema dei dati che non vengono aggiornati subito (promise crea una promessa che si trasforma in un oggetto che può essere risolto o rigettato) 
        return new Promise(async(res, rej) => {
            if(item.id) {
                //update
                /* qui aggiorno subito lo stato (visivamente) */
                setItems(prevItems => prevItems.map(prevItem => prevItem.id === item.id ? item : prevItem))

                /* poi mando i dati al backend e gestisco la risposta */
                // fetch(import.meta.env.VITE_API_URL + '/items/' + item.id, {
                //     method: 'PUT',
                //     headers: {
                //         'Content-Type': 'application/json', 
                //     },
                //     body: JSON.stringify(item),
                // })
                // .then(response => {
                //     console.log(response);
                //     if(!response.ok) {    /* se la risposta non è ok */   
                //         throw new Error(response.statusText);
                //     }
                //     return response.json()
                // })
                // .then(updatedItem => {
                //     setItems(prevItems => prevItems.map(prevItem => prevItem.id === updatedItem.id ? updatedItem : prevItem))
                //     res(updatedItem);
                // }) /* arrow function senza nulla (ovvero le graffe) implica che quello che c'è dopo è il return */
                // .catch(err => {
                //     console.log(err.message);
                //     setItems(_items);
                //     toast.error('Errore dal server', {
                //         classNames: {
                //             icon: 'text-red-500',
                //             title: 'text-red-500',
                //             //description: 'group-[.toast]:text-black' /* così per cambiare il colore alla description, scritto così me lo sovrascrive. Se scrivo solo il colore non me lo visualizza, perchè ha un peso minore. */
                //         },
                //         description: err.message
                //     });
                //     rej(err);
                // })
                try {
                    const { data: updatedItem } = await myaxios.put('/items/' + item.id, item);
                    setItems(prev => prev.map(prevItem => prevItem.id === updatedItem.id ? updatedItem: prevItem));
                    res(updatedItem);
                } catch (error) {
                    setItems(_items);
                    toast.error('Errore dal server', {
                        classNames: {
                            icon: 'text-red-500',
                            title: 'text-red-500',
                        }
                    });
                    rej(error);
                }
            } else {
                //create
                // fetch(import.meta.env.VITE_API_URL + '/items', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json', 
                //     },
                //     body: JSON.stringify(item),
                // })
                // .then(response => {
                //     console.log(response);
                //     if(!response.ok) {    
                //         throw new Error(response.statusText);
                //     }
                //     return response.json()
                // })
                // .then(newItem => {
                //     setItems(prevItems => [newItem, ...prevItems]); /* aggiunge all'inizio' */
                //     res(newItem);
                // })
                // .catch(err => {
                //     setItems(_items);
                //     toast.error('Errore dal server', {
                //         classNames: {
                //             icon: 'text-red-500',
                //             title: 'text-red-500',
                //         },
                //         description: err.message
                //     });
                //     rej(err);
                // })
                try {
                    const { data: newItem } = await myaxios.post('/items', item);
                    setItems(prev => [newItem, ...prev]);
                    res(newItem);
                } catch (error) {
                    setItems(_items);
                    toast.error('Errore dal server', {
                        classNames: {
                            icon: 'text-red-500',
                            title: 'text-red-500',
                        }
                    });
                    rej(error);
                }
            } 
        });
    }

    async function deleteItem(id) {
        /* qui aggiorno subito lo stato (visivamente) */
        const item = _items.find(item => item.id === id);
        setItems(prevItems => prevItems.filter(item => item.id !== id));

        /* fetch(import.meta.env.VITE_API_URL + '/items/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
            //il body non va... non ci devono essere dati da passare
        })
        //qui il .then non va perchè l'ho gia gestito sopra, ovvero ho gia aggiornato lo stato
        .catch(err => {
            toast.error('Errore dal server', {
                classNames: {
                    icon: 'text-red-500',
                    title: 'text-red-500',
                },
                description: err.message
            });

        }) */
       try {
        await myaxios.delete('/items/' + id);
       } catch (error) {
        setItems(prev => [...prev, item]);
        toast.error('Errore del server', {
            className: {
                icon: 'text-red-500',
                title: 'text-red-500'
            }
        })
       }
    }

    return (
        <ItemContext.Provider value={{
            getListItems,
            items,
            upsertItem,
            deleteItem
        }}>{children}</ItemContext.Provider>
    )
}

export default ItemProvider;

export function useItem() {
    return useContext(ItemContext);
}