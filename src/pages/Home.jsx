import List from "@/components/List"
import Switch from "@/components/Switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useList } from "@/contexts/ListProvider"
import { cn } from "@/lib/utils";
import { AlertTriangle, CircleSlash2 } from "lucide-react";

/* lists = [] ==> significa che quando non c'è è un array vuoto */
const Home = () => {  
    const {lists, handleDelete, setSelectedList, setListToDelete, initialLoading, initialError } = useList();

    /* questo mi fa solo aprire la modal, non mi fa fare l'update */
    const handleUpdate = (list) => {
        //setModalOpen(true);
        setSelectedList(list);
        //setValue('title', list.title);
        //setValue('description', list.description);
    }

    const favoriteLists = lists.filter(list => !!list.favorite);

    const showSkeleton = initialLoading || initialError || !favoriteLists.length;

    return (
        <>
            <div className="flex justify-between px-4">
                <p className="font-bold text-2xl">Liste preferite</p>
                
            </div>
            <div className={cn(showSkeleton && 'h-[90svh] overflow-hidden [mask-image:linear-gradient(to_top,transparent_0%,black_100%)] relative')}>
                <div className="columns-3xs gap-4 px-4 py-10">
                    {showSkeleton ? <>
                        {new Array(30).fill('').map((_, index) => (
                            <Card key={index} className='break-inside-avoid mb-4 border-transparent'>
                                <CardHeader className='flex flex-row gap-2 items-center space-y-0'>
                                    <div className="w-full">
                                        <Skeleton className='h-6 w-full'/>
                                        <Skeleton className='h-[14px] w-[80%] mt-1'/>
                                    </div>
                                    <Skeleton className='size-10 flex-none'/>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <Skeleton className='h-10'/>
                                    {new Array(Math.floor(Math.random()*6) + 1).fill('').map((_,index) => (
                                        <Skeleton key={index} className='h-4'/>
                                    ))}
                                    <div className="flex justify-between items-center py-4 flex-wrap">
                                        <Skeleton className='h-4 w-[120px]'/>
                                        <Skeleton className='size-4'/>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Switch value={true}>
                            <Switch.Case value={!!initialError}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs flex flex-col justify-center items-center gap-4 bg-orange-500/10 p-8 rounded-xl backdrop-blur-md">
                                    <AlertTriangle className="size-14 text-orange-600" />
                                    <p className="text-lg text-center">Errore nel caricamento delle liste</p>
                                </div>
                            </Switch.Case>
                            <Switch.Case value={!favoriteLists.length}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs flex flex-col justify-center items-center gap-4 p-8 rounded-xl bg-background border">
                                    <CircleSlash2 className="size-14 " />
                                    <p className="text-lg text-center">Aggiungi una lista ai preferiti</p>
                                </div>
                            </Switch.Case>
                        </Switch>
                    </> : favoriteLists.filter( list => list.favorite ).map(list => <List key={list.id} list={list} onDelete={setListToDelete} onUpdate={handleUpdate}/>)}
                </div>
            </div>
        </>
    )
}

export default Home

//alt+shif+o ==> elimina input che non uso