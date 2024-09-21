import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const AlertDialog = ({
  open,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
  cancelText,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {cancelText || "Cancel"}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {confirmText || "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
