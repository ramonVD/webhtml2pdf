import './App.css';
import Optionsbox from './components/optionsList/optionsbox';
import DragDrop from './components/draganddrop/dropzone';

function App() {
  return (
    <div className="App">
      <div>Navbar</div>
      <div>Central text</div>
      <Optionsbox />
      <div className="text-center">
        <DragDrop />
      </div>
    </div>
  );
}

export default App;
