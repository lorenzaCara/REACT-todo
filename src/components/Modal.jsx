import { createPortal } from "react-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { cloneElement, useState } from "react"
import { Loader2, Save } from "lucide-react"

const Modal = ({ children, trigger, title, description, formId, isOpen = false, onOpenChange, isLoading, onSubmit }) => {
    //const [open, setOpen] = useState(false);

    //serve per gestire la modale anche dall'esterno, quando mi serve. Uso l'|| per determinare di usare quello esterno da fuori e quello interno da dentro
    const [internalOpen, setInternalOpen] = useState(isOpen);
    const open = isOpen || internalOpen;
    const setOpen = onOpenChange || setInternalOpen; /* gli dico di prendere il setter esterno ma se non lo trova prende quello interno */

    return <>
        {trigger && cloneElement(trigger, {onClick: () => setOpen(true)})}
        {open && createPortal(
            <div className="fixed w-screen h-screen top-0 left-0 bg-black/70 flex items-center justify-center z-40" onClick={() => setOpen(false)}>
                <Card className='w-full max-w-lg' onClick={e => e.stopPropagation()}>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                    <CardFooter className='justify-end gap-4'>
                        <Button variant='secondary' onClick={() => setOpen(false)}>Chiudi</Button>
                        <Button 
                            disabled={isLoading}
                            form={formId}
                            onClick={onSubmit} /* onClick è per il submit della form. Se non lo metto non fa il submit. */
                        >
                            {isLoading ? <Loader2 className="animate-spin"/> : <Save />}
                            Salva
                        </Button> {/* questo button non è dentro la form, quindi non puo fare la submit. Per fargli fare la form scrivo form='id'. Id è quello della form. */}
                    </CardFooter>
                </Card>
            </div>
            , document.body
        )}
    </>
}

export default Modal

/* createPortal => per dire quale pè il genitore su cui andare a mettere quell'html. Adesso quel modal si trova direttamente dentro a body. Risolve i problemi di z-index se voglio elevare il mio elemento ma un altro gli si sovrappone*/
/* clone element => clona l'elemento. All'elemento clonato posso assegnare i caratteri del bottone che altrimenti non avrebbe perchè è una variabile.  */
/* e.stopPropagation() => evita che si chiuda la modal quando clicco anche sulla modal. Ovvero permette alla modal di chiudersi solo quando clicco fuori dalla modal, sullo sfondo. */
/* onOpen e onOpenChange sono fatti per gestire la modal dall'esterno */