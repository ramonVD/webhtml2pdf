
/*File uploader defaults*/
export const UPLOADED_FILE_SETTINGS = {
    allowedFileFormats: ["text/html"],
    fileSizeMBLimit: 5,
    filesLimit: 1
};

export const FILE_UPLOADER_STATE = {
    INIT: "INIT",
    PROCESSING: "PROCESSING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE"
};

export const FILE_UPLOADER_STATE_JSX = {
    INIT: <>
            <div className="md:text-lg py-2">
                Arrossega un arxiu html dins aquesta capsa
            </div>
            <div className="md:text-lg">O clica-la</div>
            </>,
    PROCESSING: <div className="mb-4">
                    Editant l'arxiu i preparant-lo per passar a pdf...
                </div>,
    SUCCESS: <>
                <div className="md:text-2xl py-3 text-green-500 font-bold">Fet</div>
                <div className="md:text-lg mb-4">prem un altre cop per buscar un altre arxiu</div>
            </>,
    FAILURE: <>Hi ha hagut algun error carregant l'arxiu</>
}