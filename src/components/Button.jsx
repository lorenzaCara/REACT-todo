/* const Button = ({children, ...props}) => { const Button = ({children, ...props}) => { con props gli passo tutte le proprietà che di base ha il tag in questione

    return (
        <button {...props} className="bg-white px-4 py-2 rounded-md">{children}</button>
    )
} */

    const Button = ({children, onclick}) => { /* con props gli passo tutte le proprietà che di base ha */

        return (
            <button onClick={onclick} className="bg-white px-4 py-2 rounded-md">{children}</button>
        )
    }

export default Button