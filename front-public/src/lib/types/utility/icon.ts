import { Icon, IconProps } from '@tabler/icons-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type AppIconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
