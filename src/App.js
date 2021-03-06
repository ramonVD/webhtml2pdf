import './App.css';
import FileUploader from './components/fileuploader/fileuploader';
import InfoModal from './components/infoModal/infoModal';
import {infomodalJSX, problemsModalJSX} from './components/infoModal/modalTextJSX';

function App() {

  return (
    <div className="App">
      <nav className="bg-teal-50 border border-b-slate-600 pt-2 pb-3 dark:bg-gray-800 flex flex-wrap justify-center mx-auto mb-12 align-center items-center">
              <span className="md:text-4xl sm:text-3xl text-2xl font-bold text-green-600 transition ease-in-out delay-50 hover:scale-110 hover:text-orange-400 cursor-pointer self-end"
              >Passa llibres HTML a PDF</span>
          <div className="sm:absolute static float-right inset-y-1 right-2 pl-4">
            <div className="flex justify-end">
              <InfoModal buttonText="📄" title="Instruccions">
                {infomodalJSX}
              </InfoModal>
              <InfoModal buttonText="🤒" title="Problemes?" 
              buttonDecoration='bg-red-50 border-red-500 hover:bg-red-300'>
                {problemsModalJSX}
              </InfoModal>
              </div>
          </div>
      </nav>
      <FileUploader />
    </div>
  );
}

export default App;
