import { NavigationLink } from '@/router/NavigationLinks';
import { classNames } from '@/utils';

interface SidebarItemIconProps {
    iconDefinition?: NavigationLink['icon'];
    isParentActive: boolean;
    isSidebarCollapsed: boolean;
}

const SidebarItemIcon: React.FC<SidebarItemIconProps> = ({
    iconDefinition,
    isParentActive,
    isSidebarCollapsed,
}) => {
    if (!iconDefinition) {
        return null;
    }

    const solidIcon = iconDefinition.solid;
    const outlineIcon = iconDefinition.outline;

    const shouldUseSolidIcon = isParentActive && solidIcon;
    const IconComponent = shouldUseSolidIcon
        ? solidIcon
        : outlineIcon;

    if (!IconComponent) {
        return null;
    }

    return (
        <IconComponent
            className={classNames(
                'h-6 w-6 flex-shrink-0 text-current',
                (!shouldUseSolidIcon && outlineIcon)
                    ? 'group-hover:text-primary'
                    : '',
                isSidebarCollapsed ? 'mr-0' : 'mr-3'
            )}
            aria-hidden="true"
        />
    );
};

export default SidebarItemIcon;
