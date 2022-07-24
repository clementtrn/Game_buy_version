import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import "../../../styles/TactBandeauBottom.css"


export default function Bulle({
    open,
    handleClose,
    texte,
    sourceImage,
    action,
    coutInter,
    coutEq
}) {
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

// .
const Transition = React.forwardRef(function Transition(props, ref) {
    return (
      <div
          style={{
            position:'absolute',
            // left:100/6*Math.min(num,5)+"%",
          }}
          >
          <Slide direction="up" ref={ref} {...props} />
        </div>
        
        )
  });

  return (
    // <div 
    //     className="bulle-info"
    //     style={{
    //       display:!open?  "none" : null,
    //         // position:"absolute",
    //         // bottom:100,
    //         // left:"20%"
    //         // flexDirection:"row"
    //     }}
    // >
      /* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button> */
      <Dialog
        open={open!=null ? open : false}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>handleClose()}
        style={{
          display:!open?  "none" : null,
          // backgroundColor:"red"
        }}
        // aria-labelledby="alert-dialog-slide-title"
        // aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle >{title}</DialogTitle> */}
        <DialogContent>
          <img src = {sourceImage}/>
          
          <DialogContentText >
            <label className="title-action" style={{marginBottom:5}}>{action}</label>
            <span style={{textAlign:"justify"}}>{texte}</span>

            <span style={{fontWeight:"bold",fontStyle:"italic",marginTop:5}}>{coutInter!==null ?  "Coût Intervention : "+coutInter+ " €" : null}</span>
            <span style={{fontWeight:"bold",fontStyle:"italic"}}> {coutInter!==null ?  "Coût Equipement : "+coutEq+ " €" : null}</span>

          </DialogContentText>
        </DialogContent>
        <DialogActions
          disableSpacing={true}
        >
         
          <Button onClick={()=>handleClose()} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
  );
}