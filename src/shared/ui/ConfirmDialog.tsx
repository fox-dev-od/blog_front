import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Скасувати</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>
        Підтвердити
      </Button>
    </DialogActions>
  </Dialog>
);
