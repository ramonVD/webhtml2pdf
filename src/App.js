import './App.css';
import Optionsbox from './components/optionsList/optionsbox';
import FileUploader from './components/draganddrop/file-uploader';

function App() {

  return (
    <div className="App">
      <div>Navbar</div>
      <div>Central text</div>
      <Optionsbox />
      <div className="flex flex-col flex-wrap items-center justify-center py-3">
        <FileUploader />
      </div>
    </div>
  );
}

export default App;
