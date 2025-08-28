import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import LogoFull from '@/src/components/LogoFull';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import ThemePicker from '@/src/components/layout/ThemePicker';
import ConnectButton from '@/src/components/layout/ConnectButton';
import { Button } from '@/src/components/ui/Button';

type NavItem = {
  label: string;
  url: string;
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    url: '/',
  },
  {
    label: 'Governance',
    url: '/governance',
  },
  {
    label: 'Treasury',
    url: '/finance',
  },
  // {
  //   label: 'Verification',
  //   url: '/verification',
  // },
  // {
  //   label: 'Settings',
  //   url: '/settings',
  // },
];

const Navitem = ({ item }: { item: NavItem }) => {
  return (
    <NavLink
      key={item.label}
      to={item.url}
      className={({ isActive, isPending }) =>
        cn(
          'rounded-md px-4 py-2 text-lg font-semibold ring-ring ring-offset-2 ring-offset-background focus:outline-none focus:ring-2',
          isActive && 'bg-highlight text-primary shadow-md',
          isPending && ''
        )
      }
    >
      {item.label}
    </NavLink>
  );
};

const Navbar = () => {
  return (
    <div className="mt-20 flex w-full flex-row items-center justify-between lg:mt-0">
      {/* Desktop logo */}
      <LogoFull className="mt-4 hidden h-[6rem] w-[6rem] lg:block" />

      {/* Mobile nav */}
      <nav className="relative lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="group" size="sm">
              <HiBars3 className="h-6 w-6 group-data-[state=open]:hidden" />
              <HiXMark className="h-6 w-6 group-data-[state=closed]:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute -left-6 origin-top">
            <DropdownMenuGroup>
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  className="hover:cursor-pointer"
                >
                  <Navitem item={item} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Mobile logo */}
      <LogoFull className="h-fit w-32 xs:w-40 lg:hidden" />

      {/* Desktop nav */}
      <nav className="hidden px-4 py-6 lg:flex lg:flex-row lg:gap-x-2">
        {navItems.map((item) => (
          <Navitem key={item.label} item={item} />
        ))}
      </nav>

      {/* Wallet connection + dark mode toggler */}
      <div className="flex flex-row items-center gap-x-2">
        <ThemePicker />
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
