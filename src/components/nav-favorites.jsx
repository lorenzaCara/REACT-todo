import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CircleSlash2,
  Link,
  MoreHorizontal,
  Pin,
  PinOff,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {NavLink, Link as RouterLink, useNavigate, useParams} from 'react-router'
import { Button } from "./ui/button"
import { useList } from "@/contexts/ListProvider"
import { Skeleton } from "./ui/skeleton"
import Switch from "./Switch"

export function NavFavorites({
  favorites,
  onAdd
}) {
  const { isMobile } = useSidebar()
  const {initialLoading, lists, initialError, createList, setListToDelete, handleDelete} = useList()
  const { id } = useParams();
  const navigate = useNavigate();

  const toggleFavorite = async (list) => {
    await createList({...list, favorite: !list.favorite});
  }

  const deleteList = (list) => {
    setTimeout(() => {
      setListToDelete({
        data: list,
        action: () => handleDelete(list).then(() => {
          if(list.id === +id){
            const listIndex = lists.findIndex(l => l.id === list.id);
          if(listIndex === 0) {
            navigate('/');
          } else {
            navigate('/lists/' + lists[listIndex -1].id);
          }
        }
        })
      }) 
    });
  }
    

  return (
    (<SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
      Lists
      <Button 
        className="size-6 ml-auto" 
        size='icon' 
        variant='ghost'
        onClick={onAdd}
      >
        <Plus className='h-4 w-4'/>
      </Button>
      </SidebarGroupLabel>
      <SidebarMenu>
        <Switch value={true}>
          <Switch.Case value={initialLoading}>
            <div className="flex flex-col gap-2 px-2">
              {new Array(Math.floor(Math.random()*5) + 3).fill('').map((_, index) => (
                <Skeleton key={index} className='h-8 w-full'/>
              ))}
            </div>
          </Switch.Case>
          <Switch.Case value={!initialLoading && !!initialError}>
            <div className="p-6 bg-orange-500/10 flex flex-col justify-center items-center rounded-lg gap-2">
              <AlertTriangle className="size-8 text-orange-600"/>
              <p>Errore nel caricamento liste</p>
            </div>
          </Switch.Case>
          <Switch.Case value={!initialLoading && !initialError && !!lists.length}>
            {lists.map((item) => (
            <SidebarMenuItem key={item.id}>
              <NavLink to={'/lists/' + item.id} title={item.title}>
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive}>
                    {item.title}
                  </SidebarMenuButton>
                )}
              </NavLink>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}>
                  <DropdownMenuItem onClick={() => toggleFavorite(item)}>
                    {item.favorite ? <PinOff className="text-muted-foreground"/> : <Pin className="text-muted-foreground"/>}
                    <span>{item.favorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => deleteList(item)} className='focus:bg-destructive/10 text-destructive focus:text-destructive'>
                    <Trash2/>
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          </Switch.Case>
          <Switch.Case value={!initialLoading && !initialError && !lists.length }>
            <div className="p-6 bg-gray-500/10 flex flex-col justify-center items-center rounded-lg gap-2 border mx-2">
              <CircleSlash2 className="size-8"/>
              <p>Crea la tua prima lista!</p>
            </div>
          </Switch.Case>
        </Switch>
      </SidebarMenu>
    </SidebarGroup>)
  );
}
