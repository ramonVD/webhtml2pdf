/* Adapted from
https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929
Converted it to use hooks. */
import React, {useState, useRef, useEffect} from 'react';

const DragAndDrop = (props) => {  
  
  const [drag, setDragged] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  
  const dropRef = useRef(null);
  const {handleStart} = props;

  useEffect( () => {
    const dref = dropRef;
    const _getDragCounter = () => dref.current.dragCounter;
    const _setDragCounter = (value) => { dref.current.dragCounter = value; return value;};

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
    }  
    
    const handleDragIn = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(_setDragCounter(_getDragCounter()+1));
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setDragged(true);
      }
    }  
    
    const handleDragOut = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(_setDragCounter(_getDragCounter()-1));
      if (dragCounter === 0) {
        setDragged(false);
      }
    }  
    
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragged(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        props.handleDrop(e.dataTransfer.files)
        e.dataTransfer.clearData();
        setDragCounter(_setDragCounter(0));    
      }
    }  

    let div = dropRef.current;
    div.addEventListener('dragenter', handleDragIn);
    div.addEventListener('dragleave', handleDragOut);
    div.addEventListener('dragover', handleDrag);
    div.addEventListener('drop', handleDrop);

    return () => {
      let div = dref.current;
      div.removeEventListener('dragenter', handleDragIn)
      div.removeEventListener('dragleave', handleDragOut)
      div.removeEventListener('dragover', handleDrag)
      div.removeEventListener('drop', handleDrop)
    }
  }, []);

  //Move stylings to a class
    return (
      <div
        style={{display: 'inline-block', position: 'relative'}} onClick={handleStart}
        ref={dropRef} className="z-40"
      >
        {drag &&
          <div className="absolute top-0 right-0 bottom-0 left-0" style={{border: "dashed grey 4px"}}>
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                right: 0,
                left: 0,
                textAlign: 'center',
                color: 'grey',
                fontSize: 36
              }}
            >
              <div>drop here :)</div>
            </div>
          </div>
        }
        {!drag && 
        <div className="absolute top-0 right-0 bottom-0 left-0 z-40" style={{border: "dashed grey 4px"}}></div>}
        {props.children}
      </div>
    );
  }

  export default DragAndDrop;