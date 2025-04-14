import confetti from "canvas-confetti";
import {Button} from "./components/ui/button" //siccome il componente di ui non ha l'export default si mette il nome del componente tra graffe
import Title from "./components/Title"

function App() {

    const handleClick = () => {
      const custom = confetti.shapeFromText({text: 'A'})
        confetti({
            colors: ['#fff', '#000'],
            shapes: [custom],
            scalar: 2,
        });
  }

  function clickMe() {
    alert('Questa sera festa');
  }

  return (
    <div className="flex flex-col justify-center items-center bg-indigo-500 min-h-screen gap-4"> {/* min-h-screen => altezza display */}
      <Title>Titolo 2</Title>
      <Button onClick={handleClick}>Auguri Luigi</Button> {/* il button di shad usa onClick con la C maiuscola */}
      <Button onClick={clickMe}>Click me</Button>
    </div>
  )
}

export default App
