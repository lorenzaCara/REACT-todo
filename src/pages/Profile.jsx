import Button from "@/components/Button";
import { FileUploader } from "@/components/fileUploader";
import Modal from "@/components/Modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/contexts/UserProvider";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
    const { user, profileImage, profileImageUpdate } = useUser();
    const [modalOpen, setModalOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const saveProfileImage = async () => {
        if(!files.length > 0) {
            return;
        }
        setLoading(true);
        try {
            await profileImageUpdate(files[0]); //files è un array e io voglio solo il primo file
        } catch (error) {
            toast.error('Errore durante il caricamento dell\'immagine profilo');
        }
        setLoading(false);
        setModalOpen(false);
        setFiles([]); //svuoto l'array dei file
    }
    

  return (
    <div className="min-h-screen flex justify-center items-center">
        <Card className='pt-6'>
            <CardContent className="flex flex-col justify-center items-center">
                <Avatar className='size-20 border'>
                    <AvatarImage src={profileImage}/>
                   {user && <AvatarFallback className='uppercase'>
                        {user.firstName.charAt(0) + user.lastName.charAt(0)}
                    </AvatarFallback>}
                </Avatar>
                <Button onclick={() => setModalOpen(true)}>Modifica immagine</Button>
                <p className="text-2xl capitalize">{user?.firstName} {user?.lastName}</p>
            </CardContent>
        </Card>
        <Modal title={'Immagine profilo'} description={'Modifica la tua immagine profilo'} isOpen={modalOpen} onOpenChange={setModalOpen} onSubmit={saveProfileImage} isLoading={loading} >
            <FileUploader value={files} onValueChange={setFiles} maxSize={1024 * 1024 * 10 } disabled={loading}/>
        </Modal>
    </div>
  )
}

export default Profile