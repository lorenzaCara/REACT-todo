import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import Modal from "@/components/Modal"
import { useForm } from "react-hook-form"
import { useList } from "@/contexts/ListProvider"
import { useNavigate } from "react-router"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      //isActive: true,
    }
  ]
}

  /* creo schemas diversi per form diversi */
  const listSchema = z.object({
    title: z.string().min(1, {message: 'Campo richiesto'}),
    description: z.string().max(30, {message: 'Massimo 30 caratteri'}).optional(),
  })

export function AppSidebar({
  ...props
}) {

  const navigate = useNavigate();
  const { selectedList, setSelectedList, loading, createList } = useList();
  const [modalOpen, setModalOpen] = React.useState(false); /* gestistco stato della modal da fuori. Cosi posso chiuderla senza che ci sia la possibilità che non mi invii i dati */

  /* errors va passato dentro a formState */
  const {register, handleSubmit, reset, formState: {errors}, setValue, setError} = useForm({
      resolver: zodResolver(listSchema),
      criteriaMode: 'all',
      mode: 'all',
  }); /* questo hook non torna un array, ma un oggetto */

  useEffect(() => {
    if(selectedList){
      setModalOpen(true);
      setValue('title', selectedList.title);
      setValue('description', selectedList.description);
    } else {
      setModalOpen(false);
    }
  }, [selectedList])

  //RESET FORM AL CAMBIO DI STATO MODAL
  useEffect(() => {
      if(!modalOpen) {
      reset();
      setSelectedList(undefined);
      }
  }, [modalOpen]) /* quindi quando cambia lo stato di modalOpen, ovvero da false a true e viceversa mi fa il reset dei valori e messaggi di errore */

  const onSubmit = (data) => {
    /* con questa promise gli dico che mi deve chiudere la modal non immediatamente, ma solo quando ha fatto la chiamata fetch. Solo dopo che ha fatto la chiamata fetch, mi rsolve ciò che gli chiedo. Ovvero il setModal. */
    /* res in ListProvider */
    createList(data).then((newList) => {
        if(!selectedList) {
          //navigazione programmatica
          navigate('/lists/' + newList.id)
        }
        setModalOpen(false);
    }).catch((error) => {
      console.log(error);
      error.issues?.forEach((issue) => {
        const field = issue.path[1];
        setError(field, {
          types: { [issue.code]: issue.message }
        });
      })
    })
}

  return (
    (<Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites onAdd={() => setModalOpen(true)} />
          <Modal 
              trigger={<Button size='sm' className='mx-4'> <Plus />Nuova lista </Button>}
              title= 'Nuova lista'
              description= 'Crea la tua lista'
              formId='createListForm'
              isOpen={modalOpen}
              onOpenChange={setModalOpen}
              isLoading={loading}
          >
          <form id="createListForm" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <Input 
              {...register('title')} 
              placeholder='Titolo' 
              />
              <ErrorMessage
              errors={errors}
              name="title"
              render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                  <p className="text-destructive text-xs" key={type}>{message}</p>
                  ))
              }
              />
              <Textarea 
              {...register('description')} 
              className='resize-none' 
              placeholder='Descrizione'
              />
              <ErrorMessage
              errors={errors}
              name="description"
              render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                  <p className="text-destructive text-xs" key={type}>{message}</p>
                  ))
              }
              />
          </form>
        </Modal>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>)
  );
}
