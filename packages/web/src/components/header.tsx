import { NavLink } from ".";
import nlwUniteIcon from "../assets/nlw-unite.svg";

export function Header() {
  return (
    <div className="flex items-center gap-5 py-2">
      <img src={nlwUniteIcon} alt="NLW Unite icon" />

      <nav className="flex items-center gap-5">
        <NavLink href="/eventos">Eventos</NavLink>
        <NavLink active href="/participantes">
          Participantes
        </NavLink>
      </nav>
    </div>
  );
}
