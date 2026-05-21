export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const navLinks: NavLink[] = [
  { label: 'Home',         href: '/'                            },
  { label: 'Residential',  href: '/residential'                 },
  { label: 'TV Recycling', href: '/tv-recycling'                },
  { label: 'Blog',         href: '/blog'                        },
  { label: 'Corporate',    href: 'https://scarce-resources.com', external: true },
  { label: 'Contact',      href: '/contact'                     },
];
