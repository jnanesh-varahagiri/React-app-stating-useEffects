// import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRef ,useEffect} from 'react';


function Modal({ open, children }) {
  const dialog = useRef();


  

  useEffect(()=>{
    console.log('hello')
    if(open){
      dialog.current.showModal()
    }else{
      dialog.current.close()
    }
    return ()=>{
      console.log('inside')
      // clearTimeout(timer)
    }
  },[open])

  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal();
  //     },
  //     close: () => {
  //       dialog.current.close();


        
  //     },
  //   };
  // });

  return createPortal(
    <dialog className="modal" ref={dialog} >
      { open && children}
    </dialog>,
    document.getElementById('modal')
  )

 
}




export default Modal;
