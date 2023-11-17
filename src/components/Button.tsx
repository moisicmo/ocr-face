import LoadingButton from '@mui/lab/LoadingButton'
import { memo } from 'react'


interface buttonProps {
    type?: any;
    text: string;
    onClick?: any;
    startIcon?: any;
    disable?: boolean;
    loading?: boolean;
    variant?: any;
    endIcon?: any;
    sx?: object;
    color?: any;
}
export const ComponentButton = memo((props: buttonProps) => {
    const {
        type,
        text,
        onClick,
        startIcon,
        endIcon,
        disable = false,
        loading = false,
        variant = "contained",
        sx,
        color,
    } = props;
    return (
        <LoadingButton
            loading={loading}
            type={type}
            className='mt-2'
            variant={variant}
            disableRipple
            disabled={disable}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
            color={color}
            sx={sx}
        >
            {text}
        </LoadingButton>
    )
});