import './App.css';
import Optionsbox from './components/optionsList/optionsbox';
import FileList from './components/draganddrop/inhouse/filelist';

function App() {
  return (
    <div className="App">
      <div>Navbar</div>
      <div>Central text</div>
      <Optionsbox />
      <FileList />
    </div>
  );
}

export default App;
