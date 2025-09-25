import { useEffect, useState } from 'react';
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

import { NavigationLink, navigationLinks } from '@/router/NavigationLinks';

export interface BreadcrumbItem {
  name: string;
  href?: string;
  icon?: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & RefAttributes<SVGSVGElement>
  >;
}

const generateBreadcrumbs = (
  pathname: string,
  navLinks: NavigationLink[]
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];
  const pathParts = pathname.split('/').filter(Boolean);

  if (pathParts.length === 0 || pathParts[0] !== 'dashboard') {
    return [];
  }

  // Root breadcrumb
  breadcrumbs.push({
    name: 'Dashboard',
    href: pathname === '/dashboard' ? undefined : '/dashboard',
    icon: HomeIcon,
  });

  if (pathname === '/dashboard') {
    return breadcrumbs;
  }

  let currentLevelLinks = navLinks;
  let currentPath = '/dashboard';

  for (let i = 1; i < pathParts.length; i++) {
    currentPath += `/${pathParts[i]}`;

    const foundLink = currentLevelLinks.find(link => link.href === currentPath);

    if (foundLink) {
      breadcrumbs.push({
        name: foundLink.name,
        href: pathname === foundLink.href ? undefined : foundLink.href,
        icon: foundLink.icon?.outline
      });
      currentLevelLinks = foundLink.children || [];
    } else {
      if (i === pathParts.length - 1) {
        const lastSegmentName =
          pathParts[i].charAt(0).toUpperCase() +
          pathParts[i].slice(1).replace(/-/g, ' ');
        breadcrumbs.push({ name: lastSegmentName });
      }
      break;
    }
  }
  return breadcrumbs;
};

const Breadcrumbs = () => {
  const location = useLocation();
  const [crumbs, setCrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const newCrumbs = generateBreadcrumbs(location.pathname, navigationLinks);
    setCrumbs(newCrumbs);
  }, [location.pathname]);

  // Don't show breadcrumbs if it's just "Dashboard" (current page) or empty
  if (crumbs.length === 0 || (crumbs.length === 1 && !crumbs[0].href)) {
    return null;
  }

  return (
    <nav
      className="flex px-4 md:px-6 py-3 text-sm border-divider"
      aria-label="Breadcrumb"
    >
      <ol role="list" className="flex items-center space-x-1">
        {crumbs.map((crumb, index) => (
          // eslint-disable-next-line react-x/no-array-index-key
          <li key={crumb.name + index}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-foreground-400 mx-1"
                  aria-hidden="true"
                />
              )}
              {crumb.icon && (
                <crumb.icon
                  className="h-4 w-4 flex-shrink-0 mr-1.5 text-current"
                  aria-hidden="true"
                />
              )}
              {crumb.href ? (
                <NavLink
                  to={crumb.href}
                  className="text-foreground-500 hover:text-primary"
                >
                  {crumb.name}
                </NavLink>
              ) : (
                <span className="font-medium text-foreground">
                  {crumb.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
