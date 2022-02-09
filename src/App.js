import './App.css';
import Optionsbox from './components/optionsList/optionsbox';
import FileUploader from './components/draganddrop/file-uploader';

function App() {
  return (
    <div className="App">
      <div>Navbar</div>
      <div>Central text</div>
      <Optionsbox />
      <div className="text-center">
        <FileUploader />
      </div>
    </div>
  );
}

export default App;
