import React from "react";
import {Button, Dialog, DialogActions,DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const ConfirmationDialog = (pro) =>{
    const {open, onClose, title,onConfirm, description} = pro;
    return(
        <Dialog open={open} onClose={()=>
            onClose()
        }>
            <DialogTitle sx={{fontWeight:"bold"}}>{title}</DialogTitle>  
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={()=>onClose()}
                    sx={{
                        color:"white",
                        textTransform: "capitalize",
                        backgroundColor: "#f14d54",
            "&:hover": {
              backgroundColor: "#f14d54",
            },
                        marginLeft:8,
                        width:80,
                        height: 30,
                    }}>Cancel

                </Button>
                <Button
                    variant="contained"
                    onClick={()=>onConfirm()}
                    sx={{
                        color:"white",
                        height:30,
                        textTransform: "capitalize",
                        backgroundColor: "#80bf32",
            "&:hover": {
              backgroundColor: "#80bf32",
            },
                        marginLeft:8,
                        width:80,
                    }}>Ok

                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog;