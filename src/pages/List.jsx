import ListItem from "@/components/ListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useItem } from "@/contexts/ItemProvider";
import { useList } from "@/contexts/ListProvider";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Edit2, Loader2, Pin, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"

const List = () => {
    /* useParams torna un oggetto  */
    const {id} = useParams(); /* useParams torna sempre un valore che è una stringa... se voglio che sia un numero devo trasformarlo in stringa */
    const {lists, createList, setSelectedList, handleDelete, setListToDelete } = useList();
    const activeList = lists.find(list => list.id === +id);
    const activeListIndex = lists.findIndex(list => list.id === +id);

    const {items, getListItems, upsertItem, deleteItem, initialLoading } = useItem();
    const listItems = items(id);

    const [itemLabel, setItemLabel] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const navigate = useNavigate();
    const[itemsLoading, setItemsLoading] = useState(true);

    console.log(listItems);
    

    /* GLI HOOK NON POSSONO MAI STARE DOPO UNA CONDIZIONE. QUINDI PER ES. PRIMA DI IF */
    /* devo chiamare il componente items solo la prima volta che viene renderizzata, ovvero al caricamento della pagina quindi uso USEEFFECT */
    useEffect(() => {
        // getListItems(id).finally(() => {
        //     setItemsLoading(false);
        // }); /* lo faccio diventare una promise facendo il finally della fetch */
        

        //FUNZIONE AUTOINVOCANTE;
        (async function() {
            await getListItems(id); //la funzione autoinvocante mi permette di usare async await nel useEffect
            setItemsLoading(false);
        })();
    }, [id]) /* Carica gli elementi della lista al caricamento del componente o quando cambia l'id. */


    function handleCreate(e) {
        e.preventDefault();
        if(!itemLabel) return;
        //la funzione è sempre la stessa con la promise stabilita in upsertItem posso gestire il caricamento degli item e l'errore
        setCreateLoading(true);
        upsertItem({
            label: itemLabel,
            list_id: +id,
            checked: false,
        })
        .then(() => {
            //gestisco il successo
            setItemLabel("");
        })
        .catch(() => {
            //gestisco l'errore
        })
        .finally(() => {
            //ciò che succede a prescindae dal successo o dall'errore
            setCreateLoading(false);
        })
    }

    function favorite() {
        setFavoriteLoading(true);
        createList({
            ...activeList,
            favorite: !activeList.favorite, 
        }).finally(() => {
            setFavoriteLoading(false);
        })
    }

    //cosi quando ricarico la pagina non mi da piu errore
    if (!activeList) {
        return null;
    }

    return (
        /* il punto interrogativo serve perchè quando faccio il refresh della pagina mi da undefined. Mi dice che quando trova undefined mi deve mettere il titolo. => {activeList?.title} 
        <div>List {activeList.title}</div>   */
        <div className="p-4">
            {/* header */}
            {initialLoading ? 
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <Skeleton className={'h-8 w-[15%]'}/>
                    <Skeleton className={'size-8 rounded-full ml-auto'}/>
                    <Skeleton className={'size-8 rounded-full'}/>
                    <Skeleton className={'size-8 rounded-full'}/>
                </div>
                <Skeleton className={'h-4 w-[35%]'}/>
            </div> : 
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-4xl">{activeList.title}</h1>
                    <div className="flex gap-2">
                        <Button size='icon' variant='outline' className="rounded-full w-8 h-8" onClick={favorite} disabled={favoriteLoading}>
                            {favoriteLoading ? <Loader2 className="animate-spin"/> : <Pin className={cn( activeList.favorite && 'fill-foreground' )}/>}
                        </Button>
                        <Button size='icon' variant='outline' className="rounded-full w-8 h-8" onClick={() => setSelectedList(activeList)}>
                            <Edit2 />
                        </Button>
                        <Button size='icon' variant='outline' className="rounded-full w-8 h-8 text-destructive hover:text-red-500" 
                        onClick={() => setListToDelete({
                            data:activeList,
                            action: ()=> handleDelete(activeList).then(() => {
                            if(activeListIndex === 0){
                                navigate('/');
                            } else {
                                //naviga alla lista precedente 
                                navigate('/lists/' + lists[activeListIndex-1].id)
                            }
                        })
                        })}>
                            <Trash2 />
                        </Button>
                    </div>
                </div>
                {activeList?.description && <p>{activeList.description}</p>} {/* per togliere lo spazio che viene lasciato se c'è il testo della description. */}
            </div>}
            {/* content */}
            <div className="flex gap-8 mt-8 items-start">
                {/* da completare */}
                <div className="w-full p-8 border border-border rounded-xl flex flex-col gap-4">
                    <p className="text-xl font-bold">Da completare</p>
                    <form onSubmit={handleCreate} className="flex gap-2">
                        <Input
                            value={itemLabel} 
                            onChange={e => setItemLabel(e.target.value)} //ogni volta che l'utente digita qualcosa nel campo, il nuovo valore viene salvato nello stato itemLabel.
                            placeholder="Elemento..." 
                            disabled={createLoading} //ovvero se createLoading è true, il campo è disabilitato
                        />
                        <Button 
                            size='icon' 
                            className='flex-none'
                            disabled={createLoading}
                        >
                            {createLoading ? <Loader2 className="animate-spin"/> : <Plus />}
                        </Button>
                    </form>
                    {itemsLoading ? <>
                        {new Array(Math.floor(Math.random()*6) + 1).fill('').map((_,index) => (
                            <Skeleton key={index} className='h-4'/>
                        ))}
                    </> : listItems.filter(item => !item.checked).map(item => (
                        <ListItem key={item.id} item={item} onItemChange={upsertItem} removeTodo={deleteItem}/>
                    ))}
                </div>
                {/* completati */}
                <div className="w-full p-8 border border-border rounded-xl flex flex-col gap-4">
                    <p className="text-xl font-bold">Completati</p>
                    {/* GESTISCESTATO DI EMPTY = ovvero non ci sono elementi */}
                    {!itemsLoading && listItems.filter(item => item.checked).length === 0 && 
                    <div className="p-8 border border-dashed flex items-center justify-center rounded-lg">
                        <p className="text-gray-500">Non ci sono elementi</p>
                    </div>}
                    {itemsLoading ? <>
                        {new Array(Math.floor(Math.random()*6) + 1).fill('').map((_,index) => (
                            <Skeleton key={index} className='h-4'/>
                        ))}
                    </> : listItems.filter(item => item.checked).map(item => (
                        <ListItem key={item.id} item={item} onItemChange={upsertItem} removeTodo={deleteItem}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default List