import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useItem } from "@/contexts/ItemProvider"
import { EllipsisVertical, Pen, Trash2 } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import ListItem from "./ListItem"
import { Input } from "./ui/input"
import { useList } from "@/contexts/ListProvider"
import { Skeleton } from "./ui/skeleton"



const List = ({ list, onDelete, onUpdate }) => {
    const {handleDelete} = useList();
    const {getListItems, items: getItems, upsertItem, deleteItem} = useItem();
    const todos = getItems(list.id);
    const [itemsLoading, setItemsLoading] = useState(true);

    useEffect(() => {
        getListItems(list.id).finally(() => {
            setItemsLoading(false);
        });
    }, [])

    /* const items = Array.from(
            new Array(10)
        ).map((item, index) => { //math random tira fuori un numero random da 0 a 1 ==>  Math.floor(Math.random() * 10)
        return { id: useId(), label: 'item ' + index, checked: index % 2 === 0} 
    }) */

    const [todoLabel, setTodoLabel] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    return (
        <>
            <Card className="break-inside-avoid mb-4">
                <CardHeader className="flex flex-row gap-2">
                    <div className="w-full overflow-hidden">
                        <CardTitle>{list.title}</CardTitle>
                        <CardDescription className="truncate">{list.description}</CardDescription>
                    </div>
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger>
                            <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Menu</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => {
                                setDropdownOpen(false);
                                onUpdate(list);
                            }}>
                                <Pen />
                                Modifica
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => {
                                    setDropdownOpen(false);
                                    onDelete({
                                        data: list, 
                                        action: () => handleDelete(list)
                                    })
                                }}
                                className="text-destructive"
                            >
                                <Trash2 />
                                Elimina
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="gap-4 flex flex-col">
                    <form onSubmit={e => {
                        e.preventDefault();
                        //percorso per vedere in console.log il valore che inserisco dentro all'input
                        upsertItem({
                            label: todoLabel,
                            checked: false,
                            list_id: list.id
                        })
                        .then(() => {
                            setTodoLabel("");
                        });
                    }}> {/* quando ho un solo parametro posso omettere le tonde */}
                        <Input
                            name="todoLabel"
                            value={todoLabel}
                            onChange={(e) => setTodoLabel(e.target.value)}
                        />
                    </form> 
                    {itemsLoading?<>
                        {new Array(Math.floor(Math.random()*6) + 1).fill('').map((_,index) => (
                            <Skeleton key={index} className='h-4'/>
                        ))}
                    </> : todos.filter(item => !item.checked).map(item => (
                        //componente Fragment è la versione esplicitata di <></> e ci da la possibilità di usare la key senza aggiungere un div genitore. VA IMPORTATO DA REACT. Utile per tornare più elementi html in uno
                        <ListItem 
                            key={item.id} 
                            item={item} 
                            removeTodo={deleteItem}
                            onItemChange={upsertItem}
                            
                            />
                    ))}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-none">
                            <AccordionTrigger>Completati</AccordionTrigger>
                            <AccordionContent className="gap-4 flex flex-col">
                            {todos.filter(item => item.checked).map(item => (
                                <Fragment key={item.id}>
                                    <ListItem 
                                        key={item.id}
                                        item = {item} 
                                        removeTodo = {deleteItem} 
                                        onItemChange={upsertItem}
                                    />
                                </Fragment>
                            ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </>
    )
}

export default List