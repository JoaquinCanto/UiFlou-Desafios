import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import uiflou from '../assets/uiflou-logo.png';

export default function Header() {
	return (

		<Navbar isBordered position="static" data-justify="center" >
			<NavbarBrand >
				<img src={uiflou} className='max-w-79 max-h-14' />
			</NavbarBrand>
			<NavbarContent className="hidden md:flex gap-4" justify="start">
				<NavbarItem isActive>
					<Link color="primary" href="/">
						Desafíos 1 & 3
					</Link>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	)
}