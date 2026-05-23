import Button, { ButtonProps } from '@mui/material/Button';

export const AppButton = (props: ButtonProps) => (
  <Button variant="contained" disableElevation {...props} />
);
