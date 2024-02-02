import { LoadingButton } from '@mui/lab';
import LockOpenIcon from '@mui/icons-material/LockOpen';

// overload mui LoadingButton
interface LoginButtonProps extends React.ComponentProps<typeof LoadingButton> {}
const LoginButton = (props: LoginButtonProps) => {
  return (
    <>
      <LoadingButton
        variant="contained"
        type="submit"
        startIcon={<LockOpenIcon />}
        loadingPosition="start"
        {...props}
      >
        {props.children}
      </LoadingButton>
    </>
  );
};

export default LoginButton;
