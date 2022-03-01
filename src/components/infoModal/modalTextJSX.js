/*En el futur, que les imatges siguin -cat, -eng, -esp... si cal*/
const modalJSX = 
<div>
    <p className="font-bold text-2xl text-center mb-3">Instruccions d'ús</p>
    <ul style={{listStyle: "square"}} className="md:ml-5 ml-1 md:text-lg text-base">
        <li className="my-3">Primer de tot, cal descarregar el llibre per passar a PDF:</li>
        <ol style={{listStyle: "roman"}} className="md:ml-10 ml-6 my-2 md:text-lg text-base">
            <li className="my-3 text-lg font-bold"><p className="md:text-lg text-base font-normal">Accedeix al llibre dins del campus, i obre l'apartat d'opcions d'edició:</p> 
                <div className="text-center">
                <img className="inline-block my-2" src="/img/menuEditaLlibre.png" alt="llistat d'opcions d'edició" />
                </div>
            </li>
            <li className="my-3 text-lg font-bold"><p className="md:text-lg text-base font-normal">Selecciona l'opció de descarregar el llibre o el capítol.
                S'obrirà una nova finestra amb el seu contingut.</p></li>
            <li className="mt-3 mb-5 text-lg font-bold"><p className="md:text-lg text-base font-normal">
                Prem el botó dret del ratolí sobre qualsevol posició buida en aquesta nova
                finestra i s'obrirà una finestra d'opcions. Escull "anomena i desa la pàgina":</p>
                <div className="text-center">
                <img className="inline-block mt-3" src="/img/salvaHTML-cat.png" alt="anomena i desa la pàgina" />
                </div>
            </li>
            <li className="mt-3 mb-5 text-lg font-bold mb-4"><p className="md:text-lg text-base font-normal">
                Descarrega la pàgina al disc, vigila que l'opció "Pàgina web, només HTML" estigui escollida:</p>
            <div className="text-center my-2">
                <img className="inline-block my-3" src="/img/nomesHTML-cat.png" alt="llistat d'opcions d'edició" />
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
                <img className="inline-block mt-4" src="/img/salvaPDF-cat.png" alt="llistat d'opcions d'edició" />
                </div>
        </li>
    </ul>
</div>;

export default modalJSX;