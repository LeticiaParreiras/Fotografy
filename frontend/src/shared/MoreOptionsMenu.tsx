import { useState, useEffect, useRef, type PropsWithChildren } from "react";
import { Button } from "./Button";
import { EllipsisVertical } from "lucide-react";

export default function MoreOptionsMenu({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        icon={EllipsisVertical}
        variant="ghost"
        onClick={toggleMenu}
        aria-label="More options"
      />

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 min-w-40 rounded-md border border-border bg-card shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}