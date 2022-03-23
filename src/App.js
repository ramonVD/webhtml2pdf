import './App.css';
import FileUploader from './components/fileuploader/fileuploader';
import InfoModal from './components/infoModal/infoModal';
import modalJSX from './components/infoModal/modalTextJSX';

/*TO-DO: 
- Determinar si els qüestionaris poden netejar-se també de manera segura,
per cursos on la majoria d'informació es troba als qüestionaris.
*/

function App() {

  return (
    <div className="App">
      <nav className="bg-teal-50 border border-b-slate-600 pt-2 pb-3 dark:bg-gray-800 flex flex-wrap justify-center mx-auto mb-12 align-center items-center">
              <span className="md:text-4xl sm:text-3xl text-2xl font-bold text-green-600 transition ease-in-out delay-50 hover:scale-110 hover:text-orange-400 cursor-pointer self-end"
              >Passa llibres HTML a PDF</span>
          <div className="sm:absolute static float-right inset-y-1 right-2 pl-4">
              <InfoModal buttonText="?" >
                {modalJSX}
              </InfoModal>
          </div>
      </nav>
      <FileUploader />
    </div>
  );
}

export default App;
