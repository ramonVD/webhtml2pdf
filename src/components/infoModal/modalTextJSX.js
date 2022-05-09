/*Contains the possible bodies of the modal*/
/*En el futur, posar-ho en diferents idiomes...potser*/
export const infomodalJSX = 
<div>
    <p className="font-bold md:text-2xl text-xl text-center mb-3">Instruccions d'ús</p>
    <div className=" border rounded p-2 bg-orange-100 border-orange-200 text-xl mt-4 mb-5"><strong>Resum:</strong> Obre el llibre moodle, selecciona imprimir-lo, 
    descarrega la pàgina que s'obre com a fitxer HTML i carrega aquest fitxer al programa.</div>
    <p className="text-xl font-bold mb-4">Pas per pas:</p>
    <ul style={{listStyle: "square"}} className="md:ml-5 ml-1 md:text-lg text-base">
        <li className="my-3">Primer de tot, cal descarregar el llibre per passar a PDF:</li>
        <ol style={{listStyle: "roman"}} className="md:ml-10 ml-6 my-2 md:text-lg text-base">
            <li className="my-3 text-lg font-bold">
                <p className="md:text-lg text-base font-normal">
                    Accedeix al llibre dins del campus, i obre l'apartat d'opcions d'edició:
                </p> 
                <div className="text-center">
                <img className="inline-block my-2" src="./img/menuEditaLlibre.png" alt="llistat d'opcions d'edició" />
                </div>
            </li>
            <li className="my-3 text-lg font-bold">
                <p className="md:text-lg text-base font-normal">
                    Selecciona l'opció de descarregar el llibre o el capítol.
                    S'obrirà una nova finestra amb el seu contingut.
                </p></li>
            <li className="mt-3 mb-5 text-lg font-bold"><p className="md:text-lg text-base font-normal">
                Prem el botó dret del ratolí sobre qualsevol posició buida en aquesta nova
                finestra i s'obrirà una finestra d'opcions. Escull "anomena i desa la pàgina":</p>
                <div className="text-center">
                <img className="inline-block mt-3" src="./img/salvaHTML-cat.png" alt="anomena i desa la pàgina" />
                </div>
            </li>
            <li className="mt-3 mb-5 text-lg font-bold mb-4"><p className="md:text-lg text-base font-normal">
                Descarrega la pàgina al disc, vigila que l'opció "Pàgina web, només HTML" estigui escollida:</p>
            <div className="text-center my-2">
                <img className="inline-block my-3" src="./img/nomesHTML-cat.png" alt="llistat d'opcions d'edició" />
                <p className="md:text-lg text-base font-normal">No et descarreguis la pàgina web completa, només l'HTML!</p>
                </div>
            </li>
        </ol>
        <li className="my-4">Un cop tens la pàgina html del llibre o capítol al disc, busca-la i arrossega-la
            sobre la capsa. O prem sobre la capsa i busca-la al disc.<br/>
            Recorda que cal que t'hagis connectat al campus fa poc perquè
            pugui accedir a les imatges del llibre. Si no, no apareixeran.
        </li>
        <li className="my-4">Al cap d'un moment, s'obrirà la finestra d'impressió amb els continguts 
            de la pàgina. Cal que escullis "salva a PDF" a menys que 
            vulguis imprimir-la.
            <div className="text-center">
                <img className="inline-block mt-4" src="./img/salvaPDF-cat.png" alt="llistat d'opcions d'edició" />
                </div>
        </li>
    </ul>
</div>;

export const problemsModalJSX = 
<div>
    <p className="text-2xl font-bold text-blue-900">Problemes més comuns:</p>
    <ul className="mb-4">
        <li className="text-xl my-5">
            <p><strong>El pdf triga molt a aparèixer:</strong></p>
            <p className="md:ml-2">El temps de càrrega depèn del campus.
            Si no crea ràpidament l'arxiu pdf, espereu una mica i torneu-ho a provar.</p>
            <p className="md:ml-2">Si el document té moltes imatges o altres elements pot trigar una estona a crear el pdf. Deixeu-lo en 
                segon pla mentre carrega.</p>
        </li>
        <li className="text-xl my-5">
            <p><strong>Hi ha pàgines en blanc al document:</strong></p>
            <p className="md:ml-2">Si us heu deixat un element invisible que ocupi espai a la part de baix de l'última pàgina d'un capítol, 
                això farà que hi hagi una pàgina en blanc abans del següent capítol.</p>
            <p className="md:ml-2 pb-5">Si us passa això, procureu eliminar aquest element invisible del llibre o canviar la mida vertical de l'última pàgina del capítol.</p>
        </li>
    </ul>
    <div className="bg-sky-100 border rounded border-sky-300 px-3 pt-1 pb-3 mx-auto my-5" style={{maxWidth:"80%"}}>
        <p className="text-xl text-center my-5">En cas d'altres problemes, enviar un correu amb la descripció de què ha passat a Ramon Vicente (Planta 5).</p>
        <p className="text-xl text-center my-5"> Si ja no estic a l'IOC, el codi
        font està disponible a <a className="
        text-blue-600 hover:text-blue-800 visited:text-purple-600 font-bold" href="https://github.com/ramonVD/webhtml2pdf" rel="noreferrer" target="_blank">github</a> </p>
        <p className="text-xl font-bold text-center mt-3 mb-5">Última comprovació de compatibilitat: maig 2022</p>
    </div>

</div>
